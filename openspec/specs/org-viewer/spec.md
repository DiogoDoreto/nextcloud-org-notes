# org-viewer

## Purpose

The Vue component that fetches and renders `.org` files as formatted HTML inside the Nextcloud Viewer modal and the org browser page.

## Requirements

### Requirement: Viewer handler is registered for text/org
`main.js` SHALL register a viewer handler with `id: 'org-mode'` and `mimes: ['text/org']`, pointing to `OrgViewHandler.js`. The handler component SHALL be a Vue 2.7-compatible plain JS component using a `render(h)` function (not an SFC), because the Nextcloud Viewer runs Vue 2.7 and a Vue 3-compiled SFC template crashes at render time.

`main.js` SHALL insert the handler directly into `OCA.Viewer._state.handlers` before the `text` handler via a `DOMContentLoaded` listener. It SHALL also remove `text/org` from the `text` handler's `mimes` array to prevent a duplicate-registration console error. This listener is registered as an init script so it fires before Viewer.vue's own `DOMContentLoaded` callback.

`Application.php::boot()` SHALL register a listener for `OCA\Files\Event\LoadAdditionalScriptsEvent` via the `IEventDispatcher` and call `\OCP\Util::addInitScript('orgnotes', 'main')` inside that listener. This ensures `main.js` is injected into the Nextcloud Files app page before `DOMContentLoaded` handlers registered by other scripts run.

#### Scenario: Clicking a .org file opens the Org viewer
- **WHEN** a user clicks a `.org` file in the Nextcloud Files app
- **THEN** the Nextcloud Viewer modal opens and renders the file using `OrgViewHandler.js`

#### Scenario: main.js is present in Files app page scripts
- **WHEN** the Nextcloud Files app page is loaded
- **THEN** `main.js` from the orgnotes app is included in the page's script resources

### Requirement: OrgView renders Org content as formatted HTML
`OrgView.vue` SHALL fetch the file at the `path` prop via the OCS API and render the parsed result as HTML. The unified pipeline SHALL include `uniorg-parse`, `uniorg-rehype`, `rehype-highlight`, and `rehype-stringify`. The rendered output SHALL correctly represent: headings (all levels), paragraphs, bold/italic/code inline markup, hyperlinks, tables, fenced and `#+BEGIN_SRC` code blocks with language-aware syntax highlighting, TODO keywords, and timestamps.

`OrgView.vue` SHALL accept a Boolean prop `fullWidth` (default `false`). When `fullWidth` is `true`, the component SHALL NOT apply `max-width` or horizontal centering constraints, allowing it to fill its container. When `fullWidth` is `false` (default), the existing modal-optimized layout (max-width 860px, centered) SHALL apply unchanged.

#### Scenario: Org file with headings and markup renders correctly
- **WHEN** a `.org` file containing headings, bold text, and a link is opened
- **THEN** the viewer displays formatted headings, bold text, and a clickable link in HTML

#### Scenario: Code block is syntax-highlighted
- **WHEN** a `.org` file contains a `#+BEGIN_SRC python` block
- **THEN** the viewer renders the block with Python syntax highlighting applied via highlight.js CSS classes

#### Scenario: Table is rendered as an HTML table
- **WHEN** a `.org` file contains an Org-mode table
- **THEN** the viewer renders it as an HTML `<table>` element

#### Scenario: TODO keyword is visible
- **WHEN** a `.org` file contains a heading with a `TODO` or `DONE` keyword
- **THEN** the keyword is visible in the rendered output

#### Scenario: Full-width mode removes centering
- **WHEN** OrgView is rendered with `fullWidth` set to `true`
- **THEN** the component fills its container without a max-width cap

#### Scenario: Default mode preserves modal layout
- **WHEN** OrgView is rendered without the `fullWidth` prop (or with `fullWidth` false)
- **THEN** the component applies max-width 860px and horizontal centering as before

### Requirement: OrgView shows loading and error states
`OrgView.vue` SHALL display a loading indicator while the file is being fetched and parsed. If the fetch fails or parsing throws an error, the component SHALL display a human-readable error message instead of a blank or broken view.

#### Scenario: Loading indicator appears during fetch
- **WHEN** the viewer is opened and the file fetch is in progress
- **THEN** a loading spinner or skeleton is visible

#### Scenario: Error message appears on fetch failure
- **WHEN** the OCS endpoint returns a non-2xx response
- **THEN** the viewer displays an error message and does not show partial content

### Requirement: Syntax highlighting adapts to Nextcloud's theme
The app SHALL NOT import a static highlight.js theme file. Instead, highlight.js CSS class names (`.hljs`, `.hljs-keyword`, `.hljs-string`, `.hljs-comment`, `.hljs-number`, `.hljs-title`, `.hljs-built_in`) SHALL be styled using Nextcloud CSS custom properties (`--color-primary`, `--color-text-maxcontrast`, `--color-background-dark`, `--color-text-lighter`, `--color-success`, `--color-warning`). The styling SHALL be applied in `OrgView.vue` and SHALL require no JavaScript to switch themes.

#### Scenario: Syntax highlighting is correct in light mode
- **WHEN** Nextcloud is set to light theme and a code block is displayed
- **THEN** token colors are readable against a light background using Nextcloud's light-mode CSS variable values

#### Scenario: Syntax highlighting is correct in dark mode
- **WHEN** Nextcloud is set to dark theme and a code block is displayed
- **THEN** token colors are readable against a dark background using Nextcloud's dark-mode CSS variable values — with no page reload or JS intervention required

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

### Requirement: Org rendering pipeline is implemented in a shared module
The unified pipeline (`uniorg-parse` → `uniorg-rehype` → `rehype-highlight` → `rehype-stringify`) SHALL be implemented once in `src/lib/renderOrg.js` and exported as an async function. Both `OrgView.vue` and `OrgViewHandler.js` SHALL call this shared function instead of each defining their own pipeline. The function SHALL accept the org content string and an optional `idMap` object.

#### Scenario: OrgView.vue delegates to renderOrg
- **WHEN** OrgView.vue renders content
- **THEN** it calls the shared `renderOrg` function rather than constructing its own unified pipeline

#### Scenario: OrgViewHandler.js delegates to renderOrg
- **WHEN** OrgViewHandler.js processes a file
- **THEN** it calls the shared `renderOrg` function rather than constructing its own unified pipeline

### Requirement: Link handler validates URL schemes
The org link handler in `renderOrg.js` SHALL validate the URL scheme of non-`id` links before emitting an `<a>` element. Only links with an allowed scheme (`http:`, `https:`, `mailto:`, `file:`, `attachment:`) SHALL render as clickable anchors. Links with any other scheme (including `javascript:`) SHALL render as a `<span>` with the link label as text and no `href`.

#### Scenario: https link renders as anchor
- **WHEN** an org file contains `[[https://example.com][Example]]`
- **THEN** the rendered HTML contains `<a href="https://example.com">Example</a>`

#### Scenario: javascript: link is blocked
- **WHEN** an org file contains `[[javascript:alert(1)][click me]]`
- **THEN** the rendered HTML contains a `<span>` with the label text and no `<a>` element

#### Scenario: mailto link renders as anchor
- **WHEN** an org file contains `[[mailto:user@example.com][Email]]`
- **THEN** the rendered HTML contains `<a href="mailto:user@example.com">Email</a>`

### Requirement: App.vue computes and passes idMap to OrgView
`App.vue` SHALL compute an `idMap` from the loaded file list: for each file entry where `id` is non-null, map `id → path`. This map SHALL be passed as the `idMap` prop to `OrgView` whenever a file is displayed.

#### Scenario: idMap derived from file list
- **WHEN** the file list contains entries with non-null `id` fields
- **THEN** `idMap` contains one entry per such file, keyed by id, valued by path

#### Scenario: Files without id are omitted from idMap
- **WHEN** a file entry has `id: null`
- **THEN** that file does not appear in `idMap`
