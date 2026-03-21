## ADDED Requirements

### Requirement: OrgView accepts an idMap prop for link resolution
`OrgView.vue` SHALL accept an optional prop `idMap` of type `Object` (a plain object mapping org-id strings to file paths, e.g. `{ "20240101T120000.000000": "/Notes/foo.org" }`). When `idMap` is not provided, it SHALL default to an empty object. The `idMap` SHALL be passed into the unified parsing pipeline so that `[[id:xxx]]` links can be resolved at render time.

#### Scenario: OrgView renders without idMap prop
- **WHEN** OrgView is rendered without an `idMap` prop
- **THEN** the component renders normally; any `[[id:...]]` links render as plain text labels

#### Scenario: OrgView receives idMap from parent
- **WHEN** App.vue passes a populated `idMap` to OrgView
- **THEN** OrgView uses the map to resolve `[[id:...]]` links

### Requirement: id: links resolve to internal router links
When rendering a `[[id:xxx][label]]` link whose ID is present in `idMap`, the unified pipeline SHALL emit an `<a>` element whose `href` is `#/?file=<encoded-path>`. Clicking the link SHALL navigate within the app (router push) to the corresponding file. When the ID is absent from `idMap`, the link label SHALL be rendered as a `<span>` element with no `href` — not as a broken anchor.

#### Scenario: Resolved id link navigates to file
- **WHEN** a rendered org file contains `[[id:abc][My Note]]` and `idMap["abc"]` is `"/Notes/foo.org"`
- **THEN** the link renders as `<a href="#/?file=%2FNotes%2Ffoo.org">My Note</a>` and clicking it opens that file

#### Scenario: Unresolved id link renders as plain text
- **WHEN** a rendered org file contains `[[id:unknown][Orphan]]` and `"unknown"` is not in `idMap`
- **THEN** the link renders as `<span>Orphan</span>` with no href

### Requirement: App.vue computes and passes idMap to OrgView
`App.vue` SHALL compute an `idMap` from the loaded file list: for each file entry where `id` is non-null, map `id → path`. This map SHALL be passed as the `idMap` prop to `OrgView` whenever a file is displayed.

#### Scenario: idMap derived from file list
- **WHEN** the file list contains entries with non-null `id` fields
- **THEN** `idMap` contains one entry per such file, keyed by id, valued by path

#### Scenario: Files without id are omitted from idMap
- **WHEN** a file entry has `id: null`
- **THEN** that file does not appear in `idMap`
