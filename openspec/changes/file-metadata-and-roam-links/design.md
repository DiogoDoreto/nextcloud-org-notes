## Context

The app currently returns `{ path, name, mtime }` from `listFiles()`. File content is only fetched when a file is opened. `#+TITLE` and `:ID:` are always near the top of an org file — typically within the first 20 lines — making a partial read sufficient for metadata extraction.

The file list is fetched once on app load and stored in `App.vue`. `OrgView` receives only a `path` prop today; it has no awareness of other files in the vault.

## Goals / Non-Goals

**Goals:**
- Extract `title` and `id` from file headers server-side, returned in `listFiles()`
- Show title in sidebar, filter/sort against it
- Build `id→path` map in `App.vue` from the file list
- Pass `idMap` to `OrgView` and resolve `[[id:xxx]]` links at render time as internal router links

**Non-Goals:**
- Resolving links to files outside `/Notes/`
- Full-text search or content indexing
- Caching metadata in a database
- Handling files where `:ID:` appears after the first 2KB

## Decisions

### D1: Extract metadata server-side in `listFiles()`, reading first 2KB per file

**Decision:** Use `$file->fopen('r')` + `fread($handle, 2048)` instead of `getContent()`, then apply regex to extract `#+TITLE` and `:ID:`.

**Alternatives considered:**
- `getContent()` + `substr()`: reads entire file from storage before slicing — wasteful for large notes
- Separate `/metadata` endpoint: requires extra round-trip and server-side ID-lookup scan on every file open
- Client-side extraction: requires N HTTP requests for N files — unacceptable

**Rationale:** `fread(2048)` limits I/O to what's needed. All real org-roam files have `#+TITLE` and `:ID:` in the first few lines. The `/Notes/` folder is already iterated by `searchByMime()`, so no additional scanning is needed.

### D2: `id→path` map built in frontend from file list, passed as prop to OrgView

**Decision:** `App.vue` computes `idMap: Map<string, string>` from the file list and passes it to `OrgView` as a prop.

**Alternatives considered:**
- Server endpoint that resolves IDs on demand: requires scanning all files per request; slower and more complex
- OrgView fetches the file list independently: duplicates state

**Rationale:** The file list is already loaded in `App.vue` before any file is opened. Deriving `idMap` from it is free and keeps state in one place.

### D3: Link resolution via custom uniorg-rehype handler, not post-processing

**Decision:** Pass `idMap` into the unified pipeline via a custom `uniorg-rehype` visitor for `link` nodes with `linkType === 'id'`.

**Alternatives considered:**
- Post-process rendered HTML string with regex: fragile and bypasses the AST
- Rehype plugin that walks the HTML tree after `uniorgRehype`: works but requires a separate traversal pass

**Rationale:** uniorg-rehype supports custom handlers per node type. Handling `id:` links at the AST level is clean and consistent with the existing `#+TITLE` handler pattern.

### D4: Unresolvable `id:` links render as plain text (no dead `<a>` tags)

**Decision:** If an ID is not in `idMap`, render the link label as a `<span>` rather than a broken `<a href="id:...">`.

**Rationale:** Dead links that do nothing on click are worse UX than no link at all. A span preserves the label without implying navigability.

## Risks / Trade-offs

- **Files with `:ID:` beyond first 2KB** → ID will not be extracted; link will render as plain text. Acceptable: org-roam always places the property drawer at the top.
- **`fopen` on remote storage** → Some Nextcloud storage backends may not support streaming reads. Fallback: use `substr($file->getContent(), 0, 2048)` if `fopen` returns false.
- **`listFiles()` becomes slower** → Reading 2KB × N files adds latency. For typical note collections (tens to low hundreds), this is negligible. If it becomes a problem, a database cache can be added later without changing the API shape.
- **No live update of `idMap`** → If a file is opened in another tab and its ID changes, the map is stale until reload. Acceptable for a viewer app.

## Open Questions

- None — approach is fully determined.
