## 1. Typography and Block Margins

- [x] 1.1 Add typography baseline to `.org-viewer__content`: `line-height: 1.5`, `overflow-wrap: break-word`, `tab-size: 4`
- [x] 1.2 Add `margin-block-end: 1em` to `p, ul, ol, dl, blockquote, pre, table, hr`
- [x] 1.3 Add first/last-child margin reset: `> :first-child { margin-top: 0 }` and `> :last-child { margin-block-end: 0 }`

## 2. Headings

- [x] 2.1 Style `h1`–`h6` with `font-weight: bold` and descending font sizes (h1: 2em, h2: 1.5em, h3: 1.25em, h4: 1.1em, h5: 1em, h6: 0.9em)
- [x] 2.2 Add `margin-block-end: 0.5em` to all headings

## 3. Lists

- [x] 3.1 Style `ul` with `list-style-type: disc` and `padding-inline-start: 4ch`
- [x] 3.2 Style `ol` with `list-style-type: decimal` and `padding-inline-start: 4ch`
- [x] 3.3 Style `dl > dt` with `font-weight: bold` and `margin-block-end: 0.25em`
- [x] 3.4 Style `dl > dd` with `margin-inline-start: 2ch` and `margin-block-end: 0.25em`

## 4. Blockquote and Horizontal Rule

- [x] 4.1 Style `blockquote` with `border-inline-start: 2px solid var(--color-border-dark)`, `padding-inline-start: 1em`, `color: var(--color-text-maxcontrast)`
- [x] 4.2 Style `hr` with `border: none`, `border-top: 1px solid var(--color-border)`, `margin-block: 1.5em`

## 5. Inline Elements

- [x] 5.1 Style `a` with `text-decoration: underline` and `color: var(--color-primary-element)`
- [x] 5.2 Style `img` with `max-width: 100%` and `height: auto`
- [x] 5.3 Style `code.inline-code, code.inline-verbatim` with monospace font, `background: var(--color-background-dark)`, small padding, and `border-radius: var(--border-radius)`

## 6. Code and Special Blocks

- [x] 6.1 Add `direction: ltr` to `pre.src-block` (code block LTR enforcement)
- [x] 6.2 Style `pre.verse` with `font-style: italic`, `white-space: pre-wrap`, `font-family: inherit`, and a left border accent using `var(--color-border-dark)`
- [x] 6.3 Style `div.example` with `font-family: monospace`, `background: var(--color-background-dark)`, padding, and `border-radius: var(--border-radius)`
- [x] 6.4 Style `div.center` with `text-align: center`

## 7. Tables

- [x] 7.1 Style `table` with `border-collapse: collapse` and `border: 1px solid var(--color-border-maxcontrast)`
- [x] 7.2 Style `th, td` with `padding: var(--default-grid-baseline)` and `border: 1px solid var(--color-border-maxcontrast)`
- [x] 7.3 Style `th` with `background: var(--color-background-dark)` and `font-weight: bold`

## 8. Org-Specific Spans

- [x] 8.1 Style `span.todo-keyword` base: `font-weight: bold`, `font-size: 0.85em`, `text-transform: uppercase`, `margin-inline-end: 0.4em`
- [x] 8.2 Add color override `span.todo-keyword.TODO, span.todo-keyword.FIXME { color: var(--color-warning) }`
- [x] 8.3 Add color override `span.todo-keyword.DONE { color: var(--color-success) }`
- [x] 8.4 Style `span.tag` with `background: var(--color-background-dark)`, `border-radius: var(--border-radius)`, padding, `font-size: 0.85em`, `margin-inline-start: 0.25em`
- [x] 8.5 Style `span.priority` with `font-weight: bold`, `color: var(--color-text-maxcontrast)`, `margin-inline-end: 0.4em`

## 9. Footnotes

- [x] 9.1 Style `div.footnote-definition` with `border-top: 1px solid var(--color-border)`, `padding-top: 0.5em`, `font-size: 0.875em`, `color: var(--color-text-maxcontrast)`

## 10. Build Verification

- [x] 10.1 Run `cd app && pnpm run build` and confirm no errors
- [x] 10.2 Run `nix build` and confirm successful output
