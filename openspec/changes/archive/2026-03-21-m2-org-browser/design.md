## Context

M1 delivered a working org viewer that opens files via Nextcloud's Viewer modal. The app has a `PageController` serving `GET /` and a stub template, but the page does nothing. The OCS file API fetches a single file by path. There is no navigation entry and no file listing capability.

The standalone page needs to discover files, let the user navigate them, and render them — all without modal chrome. The existing `OrgView.vue` component is the rendering primitive; it accepts a `path` prop and handles fetch/parse/render internally.

## Goals / Non-Goals

**Goals:**
- First-class browse experience for `.org` files under `Notes/`
- Navigation entry visible in every Nextcloud page
- Sidebar with filter and sort, main area with rendered file
- Deep-link support (`#/?file=<path>`) for bookmarks and browser history
- Keep `js/main.js` (viewer handler) lean — no new code loaded on every page

**Non-Goals:**
- Configurable root folder (deferred — hardcoded to `Notes/`)
- Editing org files
- Pagination or virtual scrolling for very large file lists
- Mobile / narrow viewport optimization

## Decisions

### Two separate Vite entry points

`src/main.js` (viewer handler) loads on every Nextcloud page via the app's asset registration. Adding sidebar/router code there would bloat a script loaded globally. A second entry `src/app.js` is only loaded by the `index` template, keeping each bundle focused.

The build switches from `lib` mode (single IIFE) to `rollupOptions.input` (multi-entry), producing `js/main.js` and `js/app.js`. Both remain IIFE format with Vue externalized.

### Vue Router hash mode for deep-linking

Nextcloud apps run under `/apps/<id>/` and PHP handles the root route. HTML5 history mode would require the PHP controller to catch-all subpaths, adding routing complexity. Hash mode (`createWebHashHistory`) keeps all client-side routing in the fragment — no server changes needed. The selected file is stored as a query param in the hash: `#/?file=/Notes/meeting.org`.

### File listing via OCS + IRootFolder search

A new `listFiles()` action on `OrgController` uses `IRootFolder::getUserFolder()->search()` filtered by MIME type `text/org`, then filters results to paths under `Notes/`. Nextcloud's file cache indexes MIME types, so this is a DB query, not a filesystem scan. Returns `[{path, name, mtime}]`.

Alternative considered: WebDAV PROPFIND with depth infinity. Rejected — more complex to parse in PHP, no advantage over the existing OCS pattern.

### OrgView reuse with full-width prop

`OrgView.vue` currently applies `max-width: 860px` centering suited for a modal. Rather than duplicating the component, a Boolean prop `fullWidth` (default `false`) removes the constraint when set. The viewer modal path is unchanged; the browser page sets `fullWidth`.

### Navigation via info.xml `<navigations>`

Nextcloud reads `<navigations>` from `info.xml` at app install/enable time and adds the entry to the top navigation bar. This is the standard, declarative approach — no PHP registration code needed. The icon is loaded from `img/app.svg` by convention.

## Risks / Trade-offs

- **Large `Notes/` trees**: A folder with thousands of `.org` files will return a large JSON payload and a long sidebar list. No mitigation in this change (pagination deferred). Acceptable for typical personal use.
- **`Notes/` doesn't exist**: If the user has no `Notes/` folder, the endpoint returns an empty list. The UI should show an empty state, not an error.
- **mtime accuracy**: `mtime` reflects the file's last-modified timestamp, which clients can set arbitrarily. "Sort by last modified" may not always reflect actual edit recency. Accepted — this is the standard Nextcloud files sort behaviour.
- **Hash routing and Nextcloud's SPA guard**: Nextcloud does not interfere with hash fragments, so `#/?file=...` is safe.

## Open Questions

- Should the sidebar show the full path or just the filename? (Files in different subdirectories of `Notes/` may share names.) Proposed default: filename with full path as tooltip.
