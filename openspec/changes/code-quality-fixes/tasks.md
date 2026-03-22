## 1. PHP Backend Fixes

- [ ] 1.1 Add path validation to `getFile` in `OrgController.php`: reject paths that don't start with `/Notes/` with a 403 response
- [ ] 1.2 Add path validation to `putFile` in `OrgController.php`: same `/Notes/` restriction
- [ ] 1.3 Simplify `listFiles` header reading: replace `fopen`/`fread`/fallback block with `substr($file->getContent(), 0, 2048)`
- [ ] 1.4 Add null guard for `getUser()` in `Application.php`: throw a `RuntimeException` if `getUser()` returns null

## 2. Shared Rendering Module

- [ ] 2.1 Create `src/lib/renderOrg.js` with an exported async `renderOrg(content, { idMap })` function containing the full unified pipeline (`uniorg-parse` → `uniorg-rehype` → `rehype-highlight` → `rehype-stringify`)
- [ ] 2.2 Implement URL scheme allowlist in the link handler inside `renderOrg.js`: `http:`, `https:`, `mailto:`, `file:`, `attachment:` render as `<a>`; all other schemes render as `<span>`
- [ ] 2.3 Include `id`-type link resolution (using `idMap`) in `renderOrg.js` — ported from `OrgView.vue`'s existing link handler

## 3. Frontend Refactoring

- [ ] 3.1 Convert `OrgView.vue` from Options API to Composition API (`defineComponent` + `setup()`), keeping identical props and template
- [ ] 3.2 Replace `OrgView.vue`'s inline unified pipeline with a call to `renderOrg` from `src/lib/renderOrg.js`
- [ ] 3.3 Fix import ordering in `OrgViewHandler.js`: move all `import` statements to the top, place the style injection block after them
- [ ] 3.4 Replace `OrgViewHandler.js`'s inline unified pipeline with a call to `renderOrg` from `src/lib/renderOrg.js` (without `idMap`)

## 4. Cleanup

- [ ] 4.1 Remove all empty JSDoc stubs (`/** * */`) from `OrgFile.vue`
- [ ] 4.2 Rename `Sidebar.vue` component `name` from `'OrgSidebar'` to `'Sidebar'`

## 5. Verification

- [ ] 5.1 Run `pnpm run lint:fix` and confirm no errors or warnings
- [ ] 5.2 Run `nix build` and confirm it succeeds
