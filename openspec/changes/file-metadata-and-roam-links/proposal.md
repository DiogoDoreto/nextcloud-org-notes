## Why

Org files often contain rich metadata — a human-readable `#+TITLE` and a unique `:ID:` in the properties drawer — that the app currently ignores. Surfacing the title in the file list makes navigation more meaningful, and extracting the ID enables org-roam-style `[[id:...]]` links to resolve to the correct file within the app.

## What Changes

- `listFiles()` extracts `#+TITLE` and `:ID:` from the first 2KB of each file and includes them in the response
- The file list sidebar shows the file title (falling back to filename if no title) and filters against it
- The sort-by-name options sort by title rather than filename when a title is present
- `App.vue` builds an `id→path` map from the file list and passes it to `OrgView`
- `OrgView` resolves `[[id:xxx][label]]` links at render time, emitting internal router links

## Capabilities

### New Capabilities

- `org-file-metadata`: Server-side extraction of `#+TITLE` and `:ID:` from org file headers, returned as part of the file list API response

### Modified Capabilities

- `org-files-api`: `listFiles()` response now includes `title` (string | null) and `id` (string | null) per file
- `org-file-browser`: File list displays title, filters by title, sorts by title
- `org-viewer`: Resolves `id:` links using an `idMap` prop; emits router-navigable anchor elements

## Impact

- `app/lib/Controller/OrgController.php` — `listFiles()` reads file header, extracts metadata
- `app/src/App.vue` — computes `idMap` from file list, passes to `OrgView`
- `app/src/components/Sidebar.vue` — filter and sort use title field
- `app/src/components/FileItem.vue` — displays title instead of filename
- `app/src/views/OrgView.vue` — new `idMap` prop, custom `uniorg-rehype` link handler
- No new dependencies required
