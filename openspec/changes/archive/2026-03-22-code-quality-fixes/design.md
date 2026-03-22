## Context

The app has two surfaces that render org content: the Nextcloud Viewer integration (`OrgViewHandler.js`, Vue 2.7-compatible) and the browser app (`OrgView.vue`, Vue 3). Both contain an identical `unified()` pipeline. The PHP API accepts arbitrary user-relative paths from the frontend without restricting to the `/Notes/` directory that `listFiles` already enforces. `Application.php` calls `getUser()->getUID()` without a null guard. Several cosmetic/style issues exist across the frontend.

## Goals / Non-Goals

**Goals:**
- Prevent path traversal in `getFile` / `putFile`
- Block dangerous URL schemes in the org link handler
- Null-guard `getUser()` in Application.php
- Eliminate the duplicated rendering pipeline
- Consistent Composition API across all Vue components
- Remove dead/noisy code (empty stubs, name mismatch, bad import order)

**Non-Goals:**
- Adding HTML sanitization via `rehype-sanitize` (uniorg parses org syntax, not raw HTML; a scheme allowlist is the targeted fix)
- Making the `/Notes/` directory configurable
- Migrating the Nextcloud DI to attribute-based injection
- Any feature changes

## Decisions

### 1. Shared rendering module: `src/lib/renderOrg.js`

Extract the `unified()` pipeline into a single exported async function:

```js
// src/lib/renderOrg.js
export async function renderOrg(content, { idMap = {} } = {}) { ... }
```

Both `OrgView.vue` and `OrgViewHandler.js` call this. The `idMap` option is passed only by `OrgView.vue` (the browser app); `OrgViewHandler.js` omits it (the Viewer context has no cross-file id resolution).

**Alternative considered**: keep duplication, accept it as intentional isolation between Vue 2 and Vue 3 contexts. Rejected — the pipeline itself is not Vue-version-specific; only the render function is.

### 2. Path validation in OrgController

Call `getUserFolder()->get($path)` first (letting Nextcloud normalise `..` segments), then check `getRelativePath($file->getPath())` against `/Notes/`. Checking the raw input string with `str_starts_with` is insufficient — `/Notes/../private/file` passes that check but resolves outside `/Notes/` after normalisation.

**Alternative considered**: `str_starts_with` on the raw `$path` input. Rejected — does not protect against `..` traversal segments.

### 3. URL scheme allowlist in link handler

In the `link` handler inside `renderOrg.js`, when a non-`id` link falls through to default processing, check `org.rawLink` against an allowlist (`https?:`, `mailto:`, `file:`, `attachment:`). Return a `<span>` for unrecognised schemes instead of an `<a>`.

**Alternative considered**: `rehype-sanitize` as a pipeline step. More comprehensive but heavier; the targeted scheme check covers the actual attack vector without pulling in a new dependency.

### 4. Convert OrgView.vue to Composition API

Straightforward mechanical rewrite: `data()` → `ref()`, `watch` → `watchEffect`/`watch`, `methods` → functions in `setup()`. No behaviour change.

### 5. Null guard in Application.php

```php
$user = $c->get(\OCP\IUserSession::class)->getUser();
if ($user === null) {
    throw new \RuntimeException('OrgController requires an authenticated user');
}
return new OrgController(..., $user->getUID());
```

This preserves the existing approach while making the failure explicit and clear rather than a cryptic TypeError.

### 6. listFiles header reading — kept as-is

The `fopen`/`fread`/`getContent()` fallback pattern is an intentional optimisation: `fread(handle, 2048)` reads only the bytes needed to extract metadata, while `getContent()` loads the full file into memory. The fallback exists for storage backends (e.g. external storage) that don't support stream access. A comment was added to explain this. No code change was made.

## Risks / Trade-offs

- **OrgViewHandler.js imports shared module from `src/lib/`**: The handler is built as an IIFE lib (separate Vite config). Both build configs must include `src/lib/renderOrg.js` in their bundle — verify both `vite.config.js` (main.js entry) and `vite.config.app.js` (app.js entry) pick it up via the import graph. Since it's imported by both entry points, Vite will include it automatically.
- **New `src/lib/` directory must be git-tracked**: Nix flakes only include files tracked by git. `src/lib/renderOrg.js` required `git add` before `nix build` would succeed.
- **Scheme allowlist may be too restrictive**: Custom org link types (e.g., `org-protocol:`) won't render as links. This is the conservative choice; the allowlist can be expanded per user request.
