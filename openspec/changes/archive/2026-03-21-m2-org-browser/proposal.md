## Why

The app currently opens `.org` files only through Nextcloud's Viewer modal, triggered by clicking a file in the Files app. There's no dedicated place to browse, search, and read org files as a first-class experience. Users who rely on org files for notes need a purpose-built page.

## What Changes

- Add a Nextcloud top-navigation entry pointing to `/apps/orgnotes/`
- Add a standalone browser page: left sidebar listing `.org` files, main content area showing the selected file rendered with the existing viewer
- Sidebar: debounced text filter by filename, sort by name or last modified (asc/desc)
- Deep-linking: selected file encoded in the URL hash (`#/?file=/Notes/meeting.org`) for bookmarkable, shareable links
- New backend endpoint to list `.org` files recursively under `Notes/` with path, name, and mtime
- Second Vite bundle (`js/app.js`) for the standalone app; existing `js/main.js` viewer handler remains unchanged
- App navigation icon (`app/img/app.svg`)

## Capabilities

### New Capabilities

- `org-file-browser`: Standalone page with sidebar file listing, filtering, sorting, and integrated org viewer; navigation entry; deep-link URL scheme
- `org-files-api`: Backend endpoint that lists `.org` files recursively under a root folder, returning path, name, and mtime

### Modified Capabilities

- `org-viewer`: OrgView component gains a full-width display mode for use outside the Viewer modal (style override removing max-width/centering)

## Impact

- `app/appinfo/info.xml` — adds `<navigations>` block
- `app/appinfo/routes.php` — no route changes needed (existing `GET /` route serves the page)
- `app/lib/Controller/OrgController.php` — new `listFiles()` method
- `app/src/main.js` — unchanged
- `app/src/app.js` — new entry point mounting the browser Vue app
- `app/src/views/OrgView.vue` — minor style tweak (scoped full-width mode or prop)
- `app/vite.config.js` — multi-entry build
- New dependencies: `vue-router ^4`
- New asset: `app/img/app.svg`
