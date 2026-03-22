## 1. Settings Button

- [ ] 1.1 In `OrgSidebar.vue`, add the `wide` prop and "Org Notes settings" text to the `NcButton` in the footer
- [ ] 1.2 Update the `.sidebar-footer` CSS to remove flex alignment and adjust padding for a full-width button

## 2. Empty State

- [ ] 2.1 In `App.vue`, import the app icon as a URL (`import appIconUrl from '../img/app.svg?url'`)
- [ ] 2.2 Wrap `NcEmptyContent` in a `<div class="app-empty-state">` with `height: 100%; display: flex` to enable vertical centering
- [ ] 2.3 Add the `#icon` slot to `NcEmptyContent` with an `<img>` inside a styled circular container using `background-color: var(--color-primary)`

## 3. Verify

- [ ] 3.1 Run `pnpm run lint:fix` and confirm no errors or warnings
- [ ] 3.2 Run `nix build` and confirm it succeeds
