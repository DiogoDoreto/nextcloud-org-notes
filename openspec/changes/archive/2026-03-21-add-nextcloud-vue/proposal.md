## Why

The app uses hand-rolled Vue components for its sidebar layout and controls (filter input, sort select, file items, empty state) that duplicate UI patterns Nextcloud already standardizes in `@nextcloud/vue`. Adopting the library gives us native Nextcloud look-and-feel, built-in accessibility, responsive sidebar behavior, and theme support for free — replacing custom CSS and markup that would otherwise need ongoing maintenance.

## What Changes

- Add `@nextcloud/vue@^9.6.0` as a runtime dependency
- Bump `vue` to `^3.5.18` and `vue-router` to `^5.0.0` to satisfy peer requirements
- Replace hand-rolled app layout (`App.vue`) with `NcContent` / `NcAppNavigation` / `NcAppContent`
- Replace `FilterInput.vue` with `NcAppNavigationSearch` (built into the navigation)
- Replace `SortControl.vue` (native `<select>`) with `NcActions` + `NcActionRadioButton` sort menu
- Replace `FileItem.vue` with `NcAppNavigationItem`
- Replace the "select a file" empty-state `<div>` with `NcEmptyContent`
- Delete the now-redundant `FilterInput.vue` and `SortControl.vue` component files
- Set minimum Nextcloud version to 31 in `appinfo/info.xml`

## Capabilities

### New Capabilities

- `nextcloud-vue-ui`: Use `@nextcloud/vue` components throughout the app UI, providing Nextcloud-native layout, navigation, search, sort, and empty-state patterns.

### Modified Capabilities

<!-- No existing spec-level behavior changes — the user-facing functionality (browse, filter, sort, view .org files) remains identical. Only the implementation layer changes. -->

## Impact

- **Dependencies**: `package.json` gains `@nextcloud/vue`, bumps `vue` and `vue-router`
- **Nix**: `pnpmDeps.hash` in `flake.nix` will need updating after lockfile changes
- **Components deleted**: `app/src/components/FilterInput.vue`, `app/src/components/SortControl.vue`
- **Components rewritten**: `App.vue`, `Sidebar.vue`, `FileItem.vue`
- **appinfo/info.xml**: `<nextcloud min-version>` raised to 31
- **No API or PHP changes**
