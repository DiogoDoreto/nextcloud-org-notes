## 1. Dependencies and Build Setup

- [x] 1.1 Add `@nextcloud/vue@^9.6.0` to `dependencies` in `app/package.json`
- [x] 1.2 Bump `vue` to `^3.5.18` and `vue-router` to `^5.0.0` in `app/package.json`
- [x] 1.3 Run `pnpm install` in `app/` to generate updated lockfile
- [x] 1.4 Update `pnpmDeps.hash` in `flake.nix` (run `nix build` with bogus hash, copy correct hash from error)

## 2. App Layout (NcContent / NcAppNavigation / NcAppContent)

- [x] 2.1 Rewrite `App.vue` to use `NcContent` wrapping `NcAppNavigation` and `NcAppContent`
- [x] 2.2 Remove all custom layout CSS from `App.vue` (flex, width, border-right, overflow)
- [x] 2.3 Replace the "select a file" empty-state `<div>` with `NcEmptyContent` (appropriate heading + description)

## 3. Sidebar: Search and Sort

- [x] 3.1 Add `NcAppNavigationSearch` to `Sidebar.vue` for file filtering (replacing `FilterInput` component)
- [x] 3.2 Move debounced filter logic from `FilterInput.vue` into `Sidebar.vue`
- [x] 3.3 Add `NcActions` + four `NcActionRadioButton` items for sort order in `Sidebar.vue` (replacing `SortControl` component)
- [x] 3.4 Position sort `NcActions` button alongside `NcAppNavigationSearch` in the navigation header area
- [x] 3.5 Delete `app/src/components/FilterInput.vue`
- [x] 3.6 Delete `app/src/components/SortControl.vue`

## 4. File List Items (NcAppNavigationItem)

- [x] 4.1 Replace `FileItem.vue` content with `NcAppNavigationItem`, passing `name` prop and handling click
- [x] 4.2 Wire active state: pass `:active="isActive"` (or equivalent prop) to `NcAppNavigationItem`
- [x] 4.3 Remove custom hover/active CSS from `FileItem.vue` (now handled by the component)
- [x] 4.4 Update `FileList.vue` to pass any props required by the new `FileItem.vue`

## 5. Nextcloud Version Manifest

- [x] 5.1 Update `appinfo/info.xml` to set `<nextcloud min-version="31">`

## 6. Build and Verify

- [x] 6.1 Run `pnpm run build` in `app/` and confirm no errors
- [x] 6.2 Run `nix build` and confirm successful package build
