## 1. Backend: Files Listing API

- [x] 1.1 Add `listFiles()` action to `OrgController`: search user folder by MIME type `text/org`, filter to paths under `Notes/`, return `[{path, name, mtime}]` as `DataResponse`
- [x] 1.2 Register OCS route `GET /api/v1/files` → `org#list_files` in `appinfo/routes.php`

## 2. Navigation & Icon

- [x] 2.1 Add `<navigations>` block to `appinfo/info.xml` with name "Org Notes", route `orgnotes.page.index`, icon `app.svg`
- [x] 2.2 Create `app/img/app.svg` (simple org-mode inspired icon)

## 3. Build: Multi-entry Vite Config

- [x] 3.1 Switch `vite.config.js` from `lib` mode to `rollupOptions.input` with two entries: `src/main.js` → `js/main.js` and `src/app.js` → `js/app.js`, both as IIFE with Vue externalized
- [x] 3.2 Add `vue-router` to `package.json` dependencies and run `pnpm install`

## 4. OrgView: Full-width Prop

- [x] 4.1 Add Boolean prop `fullWidth` (default `false`) to `OrgView.vue`
- [x] 4.2 Conditionally remove `max-width` and centering styles when `fullWidth` is `true`

## 5. Browser App: Vue App Entry & Router

- [x] 5.1 Create `src/app.js`: create Vue app, install Vue Router (hash mode, route `/?file` query param), mount to `#app`
- [x] 5.2 Create `src/router/index.js`: single route `/` with `App.vue` as the root component

## 6. Browser App: Components

- [x] 6.1 Create `src/App.vue`: two-column layout (sidebar + main), passes `file` query param from route to `OrgView` with `fullWidth` prop; shows empty state when no file selected
- [x] 6.2 Create `src/components/Sidebar.vue`: fetches file list from `/api/v1/files` on mount, renders `FileList`, `FilterInput`, and `SortControl`; highlights item matching current route `file` param
- [x] 6.3 Create `src/components/FilterInput.vue`: debounced (150 ms) text input that emits filtered file list to parent
- [x] 6.4 Create `src/components/SortControl.vue`: dropdown/select with options (name A→Z, name Z→A, modified newest, modified oldest); emits selected sort; defaults to modified newest
- [x] 6.5 Create `src/components/FileList.vue`: renders list of file items; clicking an item calls `router.push({ query: { file: item.path } })`
- [x] 6.6 Create `src/components/FileItem.vue`: displays filename, full path as tooltip; highlighted when `path` matches current route `file` param

## 7. Page Template

- [x] 7.1 Update `app/templates/index.php` to include `<div id="app"></div>` and a `<script>` tag loading `js/app.js`
