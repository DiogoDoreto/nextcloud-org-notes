## 1. Backend: metadata extraction in listFiles()

- [ ] 1.1 In `OrgController::listFiles()`, open each file with `$file->fopen('r')` and read the first 2048 bytes; fall back to `substr($file->getContent(), 0, 2048)` if `fopen` returns false
- [ ] 1.2 Extract `title` using a case-insensitive regex on `#+TITLE:` and `id` using a regex on `:ID:` in the header region; return `null` for each if not found
- [ ] 1.3 Add `title` and `id` to the file entry array returned by `listFiles()`

## 2. Frontend: display title in sidebar

- [ ] 2.1 In `FileItem.vue`, display `file.title ?? file.name` as the item label
- [ ] 2.2 In `Sidebar.vue`, update the filter to match against `(file.title ?? file.name).toLowerCase()`
- [ ] 2.3 In `Sidebar.vue`, update name-based sort comparators to use `(file.title ?? file.name)` as the sort key

## 3. Frontend: build idMap and pass to OrgView

- [ ] 3.1 In `App.vue`, compute `idMap` as a plain object derived from the file list: `Object.fromEntries(files.value.filter(f => f.id).map(f => [f.id, f.path]))`
- [ ] 3.2 Pass `idMap` as a prop to `OrgView` wherever it is rendered in `App.vue`

## 4. OrgView: id: link resolution

- [ ] 4.1 Add `idMap` prop to `OrgView.vue` (type `Object`, default `{}`)
- [ ] 4.2 Add a custom handler in the `uniorg-rehype` options for `link` nodes where `linkType === 'id'`: if `idMap[node.path]` exists, emit `<a href="#/?file=<encoded-path>">label</a>`; otherwise emit `<span>label</span>`
- [ ] 4.3 Verify that existing non-id links (http, file, custom-id, etc.) are unaffected by the new handler

## 5. Verification

- [ ] 5.1 Run `pnpm run build` in `app/` and confirm no errors
- [ ] 5.2 Run `nix build` and confirm it succeeds
