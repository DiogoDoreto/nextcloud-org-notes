## 1. PHP Backend Fixes

- [x] 1.1 Add path validation to `getFile` in `OrgController.php`: resolve the path through Nextcloud's filesystem, then reject via `getRelativePath()` if outside `/Notes/`
- [x] 1.2 Add path validation to `putFile` in `OrgController.php`: same normalised-path check
- [x] 1.3 ~~Simplify `listFiles` header reading~~ — reverted; `fopen`/`fread` is an intentional optimisation that avoids loading the full file into memory. `getContent()` fallback kept for storage backends that don't support streams. Added comment explaining the reason.
- [x] 1.4 Add null guard for `getUser()` in `Application.php`: throw a `RuntimeException` if `getUser()` returns null

## 2. Shared Rendering Module

- [x] 2.1 Create `src/lib/renderOrg.js` with an exported async `renderOrg(content, { idMap })` function containing the full unified pipeline (`uniorg-parse` → `uniorg-rehype` → `rehype-highlight` → `rehype-stringify`)
- [x] 2.2 Implement URL scheme allowlist in the link handler inside `renderOrg.js`: `http:`, `https:`, `mailto:`, `file:`, `attachment:` render as `<a>`; all other schemes render as `<span>`
- [x] 2.3 Include `id`-type link resolution (using `idMap`) in `renderOrg.js` — ported from `OrgView.vue`'s existing link handler

## 3. Frontend Refactoring

- [x] 3.1 Convert `OrgView.vue` from Options API to Composition API (`defineComponent` + `setup()`), keeping identical props and template
- [x] 3.2 Replace `OrgView.vue`'s inline unified pipeline with a call to `renderOrg` from `src/lib/renderOrg.js`
- [x] 3.3 Fix import ordering in `OrgViewHandler.js`: move all `import` statements to the top, place the style injection block after them
- [x] 3.4 Replace `OrgViewHandler.js`'s inline unified pipeline with a call to `renderOrg` from `src/lib/renderOrg.js` (without `idMap`)

## 4. Cleanup

- [x] 4.1 Fill JSDoc stubs in `OrgFile.vue` with meaningful descriptions — stubs cannot be removed as `@nextcloud/eslint-config` enforces `jsdoc/require-jsdoc` and re-inserts them on `lint:fix`
- [x] 4.2 Rename `Sidebar.vue` → `OrgSidebar.vue` to match the component name — renaming the name to `'Sidebar'` was rejected by the `vue/multi-word-component-names` lint rule; file was renamed instead and import in `App.vue` updated

## 5. Verification

- [x] 5.1 Run `pnpm run lint:fix` and confirm no errors or warnings
- [x] 5.2 Run `nix build` and confirm it succeeds — required `git add`ing `src/lib/renderOrg.js` and `src/components/OrgSidebar.vue` first, as Nix flakes only include tracked files
