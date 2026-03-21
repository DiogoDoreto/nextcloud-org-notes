## Why

`.org` files in Nextcloud open as raw unformatted text. Users who store Org Mode notes in Nextcloud have no way to read them meaningfully from the web interface — there is no MIME type handler, no viewer registration, and no rendering pipeline.

## What Changes

- Register `.org` as a known MIME type (`text/org`) so Nextcloud identifies and handles it correctly
- Add an OCS API endpoint that reads `.org` file content from a user's storage
- Register a Nextcloud Viewer handler for `text/org` that opens `.org` files in a dedicated component
- Implement `OrgView.vue` — a read-only renderer that parses Org syntax and displays formatted HTML
- Apply syntax highlighting via CSS custom properties that adapt to Nextcloud's dark/light theme

## Capabilities

### New Capabilities

- `mime-type-registration`: Registers the `org` extension as `text/org` in Nextcloud's MIME system
- `org-file-api`: OCS endpoint that reads `.org` file content scoped to the authenticated user's storage
- `org-viewer`: Viewer handler registration and `OrgView.vue` component with full Org parsing and theme-aware syntax highlighting

### Modified Capabilities

(none)

## Impact

- **appinfo/**: two new JSON files (`mimetypemapping.json`, `mimetypealiases.json`)
- **lib/Controller/**: new `OrgController.php` extending `OCSController`
- **appinfo/routes.php**: new OCS route entry
- **src/**: `main.js` updated; new `src/views/OrgView.vue`
- **package.json**: new JS dependencies — `uniorg-parse`, `uniorg-rehype`, `unified`, `rehype-stringify`, `rehype-highlight`, `@nextcloud/viewer`, `@nextcloud/axios`
