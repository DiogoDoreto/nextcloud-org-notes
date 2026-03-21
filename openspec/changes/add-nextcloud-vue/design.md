## Context

The app currently uses Vue 3 with hand-rolled components for all UI concerns: a flex-based sidebar layout, a plain `<input>` for filtering, a native `<select>` for sort order, simple `<div>`-based file list items, and a bare `<p>` tag for the empty state. All of these replicate patterns that `@nextcloud/vue` already provides, standardized for Nextcloud's design system.

`@nextcloud/vue` v9.x targets Nextcloud 31+ with Vue 3 support. Adopting it requires bumping `vue` to `^3.5.18` and `vue-router` to `^5.0.0` (peer requirements).

## Goals / Non-Goals

**Goals:**
- Replace the custom sidebar layout with `NcContent` / `NcAppNavigation` / `NcAppContent`
- Replace `FilterInput.vue` with `NcAppNavigationSearch`
- Replace `SortControl.vue` with `NcActions` + `NcActionRadioButton`
- Replace `FileItem.vue` with `NcAppNavigationItem`
- Replace the "select a file" empty div with `NcEmptyContent`
- Satisfy `@nextcloud/vue` peer dep requirements (vue 3.5, vue-router 5)
- Keep all user-facing functionality identical

**Non-Goals:**
- Adding new features (file icons, file actions, breadcrumbs, etc.)
- Changing the PHP backend or OCS API
- Adopting composables from `@nextcloud/vue` (out of scope for this change)

## Decisions

### 1. Sort UI: NcActions + NcActionRadioButton instead of native `<select>`

`NcActions` renders a small icon-button that opens a floating menu. Each sort option becomes an `NcActionRadioButton`, which shows the currently selected option with a radio indicator.

**Why over a styled `<select>`:** Matches the pattern used in other Nextcloud apps (Notes, Files). Fits naturally next to `NcAppNavigationSearch` in the navigation header without taking a full row. `NcActionRadioButton` communicates current selection without needing to open the menu.

**Placement:** The sort button sits inline with `NcAppNavigationSearch` in the navigation's header area (using `NcAppNavigation`'s `#header` slot or as a sibling element inside the nav).

### 2. NcAppNavigationItem with no icons

File items will use `NcAppNavigationItem` with only the `name` prop and no icon. All files are `.org` files — a per-item icon would be visual noise with no informational value (as decided in explore).

### 3. vue-router v4 → v5 bump

`@nextcloud/vue` v9 requires `vue-router ^5.0.0`. The app's router usage is minimal (one route, `query.file` param) so the upgrade surface is small. Vue Router v5 maintains the same composition API (`useRoute`, `useRouter`) used in the app; the main breaking changes are in legacy options-API patterns not used here.

### 4. Import style: per-component imports

Import each component directly:
```js
import NcAppNavigation from '@nextcloud/vue/components/NcAppNavigation'
```
Rather than from the root (`import { NcAppNavigation } from '@nextcloud/vue'`). Per-component imports keep bundle size predictable and build times fast, which matters for the Vite IIFE build.

### 5. Sidebar.vue absorbs FilterInput and SortControl logic

`FilterInput.vue` and `SortControl.vue` are deleted. Their logic (debounced filter, sort state) moves directly into `Sidebar.vue`, which is now the natural home for this state since `NcAppNavigationSearch` and the sort `NcActions` live there.

## Risks / Trade-offs

- **vue-router v5 API changes** → Mitigation: Check `useRoute`/`useRouter` call sites; the app only has two (App.vue, FileItem.vue). Vue Router v5 composition API is backwards-compatible for basic usage.
- **`@nextcloud/vue` bundle size** → Mitigation: Per-component imports + Vite tree-shaking limit what's bundled. Only the ~6 components used will be included.
- **Nix hash drift** → Mitigation: After `pnpm install`, run `nix build` with a bogus hash to get the correct one from the error output (standard project workflow per CLAUDE.md).
- **`NcAppNavigation` header slot API** → If `@nextcloud/vue` doesn't expose a clean slot for the search+sort row, we fall back to placing both as direct children of `NcAppNavigation`'s default slot above the file list.

## Migration Plan

1. Add `@nextcloud/vue`, bump `vue` and `vue-router` in `package.json`
2. Run `pnpm install`, update `pnpmDeps.hash` in `flake.nix`
3. Rewrite `App.vue` to use `NcContent` / `NcAppNavigation` / `NcAppContent`
4. Rewrite `Sidebar.vue`: absorb filter/sort state, use `NcAppNavigationSearch` + `NcActions` + `NcAppNavigationItem`
5. Delete `FilterInput.vue` and `SortControl.vue`
6. Update `FileList.vue` to remove `FileItem` import (items now rendered directly in Sidebar)
7. Replace empty-state div in `App.vue` with `NcEmptyContent`
8. Update `appinfo/info.xml` min-version to 31
9. Build and verify (`pnpm run build`, `nix build`)

No rollback complexity — all changes are local to the frontend bundle.
