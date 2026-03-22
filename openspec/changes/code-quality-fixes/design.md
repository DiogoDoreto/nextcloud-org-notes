## Context

The app has two surfaces that render org content: the Nextcloud Viewer integration (`OrgViewHandler.js`, Vue 2.7-compatible) and the browser app (`OrgView.vue`, Vue 3). Both contain an identical `unified()` pipeline. The PHP API accepts arbitrary user-relative paths from the frontend without restricting to the `/Notes/` directory that `listFiles` already enforces. `Application.php` calls `getUser()->getUID()` without a null guard. Several cosmetic/style issues exist across the frontend.

## Goals / Non-Goals

**Goals:**
- Prevent path traversal in `getFile` / `putFile`
- Block dangerous URL schemes in the org link handler
- Null-guard `getUser()` in Application.php
- Eliminate the duplicated rendering pipeline
- Consistent Composition API across all Vue components
- Remove dead/noisy code (empty stubs, name mismatch, bad import order, redundant fopen fallback)

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

Add a private helper `requireNotesPath(string $path): bool` and return 403 early from `getFile` and `putFile` if it fails. Mirrors the `str_starts_with($path, '/Notes/')` check already in `listFiles`.

**Alternative considered**: a middleware/annotation approach. Over-engineered for two endpoints.

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

### 6. Simplify listFiles header reading

Replace the `fopen`/`fread`/fallback block with a single `substr($file->getContent(), 0, 2048)`. The `fopen` path was defensive but is unnecessary: `getContent()` is the standard Nextcloud API for reading file contents and is already used in the fallback branch.

## Risks / Trade-offs

- **OrgViewHandler.js imports shared module from `src/lib/`**: The handler is built as an IIFE lib (separate Vite config). Both build configs must include `src/lib/renderOrg.js` in their bundle — verify both `vite.config.js` (main.js entry) and `vite.config.app.js` (app.js entry) pick it up via the import graph. Since it's imported by both entry points, Vite will include it automatically.
- **listFiles simplification**: `getContent()` loads the full file into memory before we take `substr`. For very large org files this is wasteful but acceptable; a future optimisation could use streaming, but that's out of scope.
- **Scheme allowlist may be too restrictive**: Custom org link types (e.g., `org-protocol:`) won't render as links. This is the conservative choice; the allowlist can be expanded per user request.
