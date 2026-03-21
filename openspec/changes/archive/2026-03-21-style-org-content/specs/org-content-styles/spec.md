## ADDED Requirements

### Requirement: Typography baseline
The org viewer content area SHALL apply a readable typography baseline: `line-height: 1.5`, `overflow-wrap: break-word`, and `tab-size: 4`.

#### Scenario: Long words do not overflow
- **WHEN** an org file contains a URL or long word that exceeds the container width
- **THEN** the word wraps within the content area without causing horizontal overflow

### Requirement: Heading hierarchy
The org viewer SHALL render org headings (levels 1–6) as styled HTML headings with progressively smaller font sizes and bold weight. The first and last block-level children SHALL have their top/bottom margin zeroed to avoid excess whitespace at container edges.

#### Scenario: Heading sizes decrease with depth
- **WHEN** an org file contains `* H1`, `** H2`, and `*** H3` headlines
- **THEN** each heading renders at a visually distinct size (h1 largest, h3 smaller)

#### Scenario: First heading has no top margin
- **WHEN** the first element in the org content is a heading
- **THEN** there is no extra space above it inside the content container

### Requirement: Paragraph and block margins
Block elements (p, ul, ol, dl, blockquote, pre, table, hr) SHALL each have a consistent bottom margin (`1em`) so content flows with readable vertical rhythm. The last block element SHALL have no bottom margin.

#### Scenario: Paragraphs are separated
- **WHEN** an org file contains two consecutive paragraphs
- **THEN** a visible gap appears between them

#### Scenario: Last element has no trailing margin
- **WHEN** the last element in the content area is a paragraph
- **THEN** there is no extra space below it inside the container

### Requirement: Unordered and ordered list indentation
Unordered lists SHALL use disc bullets. Ordered lists SHALL use decimal numbering. Both SHALL be indented with `padding-inline-start: 4ch` for visual nesting.

#### Scenario: Unordered list shows bullets
- **WHEN** an org file contains `- item` list entries
- **THEN** each item displays a bullet point

#### Scenario: Ordered list shows numbers
- **WHEN** an org file contains `1. item` list entries
- **THEN** each item displays its numeric position

### Requirement: Definition list styling
Definition lists (`dl`) SHALL render with bold terms (`dt`) and indented descriptions (`dd`) using `margin-inline-start: 2ch`.

#### Scenario: Term is bold
- **WHEN** an org file contains `- term :: description`
- **THEN** "term" renders in bold

#### Scenario: Description is indented
- **WHEN** an org file contains `- term :: description`
- **THEN** "description" renders indented relative to the term

### Requirement: Blockquote styling
Blockquotes SHALL display a left border using `--color-border-dark` and muted text color using `--color-text-maxcontrast`, matching the NcRichText pattern.

#### Scenario: Blockquote has left border
- **WHEN** an org file contains a `#+begin_quote` block
- **THEN** the rendered blockquote displays a visible left border

### Requirement: Inline code styling
Inline code (`code.inline-code`, `code.inline-verbatim`) SHALL render in a monospace font with a subtle background (`--color-background-dark`) and rounded corners.

#### Scenario: Inline code is visually distinct
- **WHEN** an org file contains `~code~` or `=verbatim=`
- **THEN** the text renders in a monospace font with a background tint

### Requirement: Link styling
Links (`a`) inside the content area SHALL be underlined to distinguish them from body text.

#### Scenario: Links are underlined
- **WHEN** an org file contains `[[https://example.com][link text]]`
- **THEN** "link text" renders as an underlined hyperlink

### Requirement: Image sizing
Images (`img`) produced from org image links SHALL be constrained to `max-width: 100%` so they do not overflow the container.

#### Scenario: Wide image is constrained
- **WHEN** an org file links to an image wider than the viewer
- **THEN** the image shrinks to fit the container width

### Requirement: Table styling
Tables SHALL use `border-collapse: collapse` with borders using `--color-border-maxcontrast` on cells and the outer table. Header cells SHALL have a distinct background (`--color-background-dark`).

#### Scenario: Table has visible borders
- **WHEN** an org file contains a table
- **THEN** cell borders are visible using the Nextcloud border color

### Requirement: Verse block styling
`pre.verse` blocks SHALL preserve whitespace and line breaks but render with a body font (not monospace), with an italic style and a left border accent.

#### Scenario: Verse block preserves line breaks
- **WHEN** an org file contains a `#+begin_verse` block with multiple lines
- **THEN** each line appears on its own line in the output

### Requirement: Example block styling
`div.example` blocks SHALL render in a monospace font with a muted background (`--color-background-dark`) and padding, similar to a code block but without syntax highlighting decoration.

#### Scenario: Example block is visually distinct
- **WHEN** an org file contains a `#+begin_example` block
- **THEN** the content renders in monospace with a background tint

### Requirement: Center block styling
`div.center` blocks SHALL apply `text-align: center` to center their content.

#### Scenario: Center block content is centered
- **WHEN** an org file contains a `#+begin_center` block
- **THEN** the block's text renders centered horizontally

### Requirement: Horizontal rule styling
`hr` elements SHALL render using `--color-border` for a theme-consistent divider line.

#### Scenario: Horizontal rule is visible
- **WHEN** an org file contains `-----`
- **THEN** a horizontal divider line appears

### Requirement: Todo keyword coloring
`span.todo-keyword` elements SHALL be color-coded: `TODO`/`FIXME` in `--color-warning`, `DONE` in `--color-success`, and unrecognized keywords in `--color-text-maxcontrast`. All keywords SHALL be bold and in a small-caps or uppercase style.

#### Scenario: TODO keyword is orange/warning color
- **WHEN** an org heading has a `TODO` keyword
- **THEN** the keyword renders in the Nextcloud warning color

#### Scenario: DONE keyword is green/success color
- **WHEN** an org heading has a `DONE` keyword
- **THEN** the keyword renders in the Nextcloud success color

### Requirement: Tag badge styling
`span.tag` elements SHALL render as inline badges with `--color-background-dark` background, `--border-radius` corners, small padding, and slightly reduced font size.

#### Scenario: Tags look like badges
- **WHEN** an org heading has tags (`:tag1:tag2:`)
- **THEN** each tag renders as a small pill/badge visually distinct from heading text

### Requirement: Priority styling
`span.priority` elements SHALL render in a muted color (`--color-text-maxcontrast`) and bold weight.

#### Scenario: Priority is visually distinct
- **WHEN** an org heading has a priority `[#A]`
- **THEN** the priority renders bold and in a muted color

### Requirement: Footnote definition styling
`div.footnote-definition` elements SHALL render with a top border separator and small font size to visually separate footnotes from body content.

#### Scenario: Footnotes are separated from body
- **WHEN** an org file contains footnote definitions
- **THEN** the footnotes section appears visually separated with a border above it
