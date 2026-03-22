## 1. Dependencies

- [ ] 1.1 Add `codemirror`, `vue-codemirror`, `@codemirror/commands`, `@codemirror/state`, `@codemirror/view` to `app/package.json` and run `pnpm install`
- [ ] 1.2 Update `pnpmDeps.hash` in the Nix build after lock file changes

## 2. Backend: PUT endpoint

- [ ] 2.1 Add `putFile(string $path, string $content)` method to `OrgController` — checks `isUpdateable()`, calls `putContent()`, returns 200 or 403/404
- [ ] 2.2 Register the PUT route for `putFile` in the app routes config

## 3. Refactor OrgView into a pure renderer

- [ ] 3.1 Change `OrgView.vue` to accept a `content` string prop instead of `path`; remove the axios fetch and `mounted` hook
- [ ] 3.2 Update `App.vue` to no longer use `OrgView` directly (it will use `OrgFile` instead)

## 4. New OrgEditor component

- [ ] 4.1 Create `app/src/components/OrgEditor.vue` wrapping `vue-codemirror` with `basicSetup` (line numbers, undo/redo, keyboard shortcuts)
- [ ] 4.2 Add a formatting toolbar above the editor using `NcButton` with buttons: Bold (`*`), Italic (`/`), Verbatim (`=`), Code (`~`)
- [ ] 4.3 Implement CM6 `StateCommand` helpers that wrap the current selection in the appropriate org delimiter pair
- [ ] 4.4 Wire `v-model` for the editor content (emit `update:modelValue` on changes)

## 5. New OrgFile component

- [ ] 5.1 Create `app/src/components/OrgFile.vue` with props: `path`, `idMap`
- [ ] 5.2 Implement fetch on mount: GET `/api/v1/file?path=...`, store `rawContent`
- [ ] 5.3 Add `editMode` ref and toggle logic; render `OrgView` when false, `OrgEditor` when true
- [ ] 5.4 Implement sticky header with title/mtime in view mode (Edit button) and Save/Cancel buttons in edit mode — move `.file-header` styles from `App.vue`
- [ ] 5.5 Implement save: PUT `/api/v1/file`, on success exit edit mode and re-render; on error show error message in header
- [ ] 5.6 Track dirty state (`isDirty` = edited content differs from fetched content)
- [ ] 5.7 Add Cancel confirmation: if `isDirty`, show `confirm()` before reverting; if not dirty, revert immediately
- [ ] 5.8 Add `onBeforeRouteLeave` guard: if `isDirty`, prompt user before allowing navigation

## 6. Wire up App.vue

- [ ] 6.1 Replace `<OrgView>` and the `.file-header` block in `App.vue` with `<OrgFile :path="..." :id-map="idMap" />`
- [ ] 6.2 Remove now-unused imports (`OrgView`, header styles) from `App.vue`

## 7. Verify

- [ ] 7.1 Run `pnpm run build` in `app/` and confirm no errors
- [ ] 7.2 Run `nix build` and confirm success
