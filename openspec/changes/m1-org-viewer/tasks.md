# Tasks: M1 Org Viewer

## 1. MIME type registration

- [ ] Create `app/appinfo/mimetypemapping.json` mapping `org` → `["text/org"]`
- [ ] Create `app/appinfo/mimetypealiases.json` mapping `text/org` → `"text"`

## 2. PHP: OCS API

- [ ] Add `OrgController.php` extending `OCSController`
  - Constructor injects `IRootFolder $rootFolder` and `string $userId`
  - `getFile(string $path)` action: resolves path via `getUserFolder`, returns content in OCS DataResponse
  - Annotated `@NoAdminRequired`
- [ ] Register OCS route in `routes.php`: `GET /api/v1/file` → `org#get_file`
- [ ] Register `OrgController` in `Application.php` DI container if needed

## 3. JS: dependencies

- [ ] Add to `app/package.json` dependencies:
  - `uniorg-parse`
  - `uniorg-rehype`
  - `unified`
  - `rehype-stringify`
  - `rehype-highlight`
  - `@nextcloud/viewer`
  - `@nextcloud/axios`
- [ ] Run `pnpm install` and verify lockfile updates

## 4. JS: viewer handler registration

- [ ] Update `app/src/main.js` to import and register `OrgView` with `@nextcloud/viewer`
  - handler id: `org-mode`
  - mimes: `['text/org']`

## 5. OrgView.vue

- [ ] Create `app/src/views/OrgView.vue`
  - Props: `path` (String), `mime` (String)
  - On mount: fetch file content via `@nextcloud/axios` from OCS endpoint
  - Run content through unified pipeline (uniorg-parse → uniorg-rehype → rehype-highlight → rehype-stringify)
  - Render resulting HTML via `v-html`
  - Show loading spinner while fetching
  - Show error message if fetch or parse fails

## 6. Syntax highlight theming

- [ ] Define CSS mapping highlight.js class names to Nextcloud CSS custom properties
  - At minimum: `.hljs`, `.hljs-keyword`, `.hljs-string`, `.hljs-comment`, `.hljs-number`, `.hljs-title`, `.hljs-built_in`
  - Verify mapping works in both light and dark Nextcloud themes
