## MODIFIED Requirements

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
