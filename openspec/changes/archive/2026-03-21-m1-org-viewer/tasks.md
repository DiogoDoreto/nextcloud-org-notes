# Tasks: M1 Org Viewer

## 1. MIME type registration

- [x] Create `app/appinfo/mimetypemapping.json` mapping `org` → `["text/org"]`
- [x] Create `app/appinfo/mimetypealiases.json` mapping `text/org` → `"text"`

## 2. PHP: OCS API

- [x] Add `OrgController.php` extending `OCSController`
  - Constructor injects `IRootFolder $rootFolder` and `string $userId`
  - `getFile(string $path)` action: resolves path via `getUserFolder`, returns content in OCS DataResponse
  - Annotated `@NoAdminRequired`
- [x] Register OCS route in `routes.php`: `GET /api/v1/file` → `org#get_file`
- [x] Register `OrgController` in `Application.php` DI container if needed

## 3. JS: dependencies

- [x] Add to `app/package.json` dependencies:
  - `uniorg-parse`
  - `uniorg-rehype`
  - `unified`
  - `rehype-stringify`
  - `rehype-highlight`
  - `@nextcloud/viewer`
  - `@nextcloud/axios`
- [x] Run `pnpm install` and verify lockfile updates

## 4. JS: viewer handler registration

- [x] Update `app/src/main.js` to import and register `OrgView` with `@nextcloud/viewer`
  - handler id: `org-mode`
  - mimes: `['text/org']`

## 5. OrgView.vue

- [x] Create `app/src/views/OrgView.vue`
  - Props: `path` (String), `mime` (String)
  - On mount: fetch file content via `@nextcloud/axios` from OCS endpoint
  - Run content through unified pipeline (uniorg-parse → uniorg-rehype → rehype-highlight → rehype-stringify)
  - Render resulting HTML via `v-html`
  - Show loading spinner while fetching
  - Show error message if fetch or parse fails

## 6. Syntax highlight theming

- [x] Define CSS mapping highlight.js class names to Nextcloud CSS custom properties
  - At minimum: `.hljs`, `.hljs-keyword`, `.hljs-string`, `.hljs-comment`, `.hljs-number`, `.hljs-title`, `.hljs-built_in`
  - Verify mapping works in both light and dark Nextcloud themes
