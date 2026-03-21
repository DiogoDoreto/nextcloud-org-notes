## Context

`OrgView.vue` injects HTML via `v-html`. Because Vue's `scoped` CSS cannot reach injected HTML, all content styles must go in a non-scoped `<style>` block scoped manually with the `.org-viewer__content` class prefix. The syntax-highlighting styles already use this pattern.

`uniorg-rehype` converts org-mode AST to HTML, producing a specific set of elements. `NcRichText` in `@nextcloud/vue` provides a proven reference for styling similar rendered-markdown content using Nextcloud CSS custom properties.

Nextcloud's design system exposes theme-aware CSS variables (`--color-main-text`, `--color-background-dark`, `--color-border-dark`, `--color-primary-element`, `--color-success`, `--color-warning`, `--color-text-maxcontrast`, `--border-radius`, `--default-grid-baseline`) that all styles should use instead of hardcoded values.

## Goals / Non-Goals

**Goals:**
- Style every HTML element that `uniorg-rehype` can produce
- Follow Nextcloud theming conventions (CSS custom properties, LTR/RTL support via logical properties)
- Mirror NcRichText patterns where they apply (blockquote, lists, tables, first/last-child margin reset)
- Add org-specific styles not present in NcRichText (dl/dt/dd, todo keywords, tags, verse/example/center blocks)

**Non-Goals:**
- Theming code blocks (already handled by existing hljs non-scoped styles)
- Modifying the uniorg/rehype processing pipeline
- Adding interactivity (e.g. checkbox todo items like NcRichText)
- Print styles

## Decisions

### 1. Placement: extend the existing non-scoped `<style>` block

**Decision**: Add all content styles to the existing non-scoped `<style>` block in `OrgView.vue`, under `.org-viewer__content`.

**Rationale**: The file already has a non-scoped block for hljs theming with the same `.org-viewer__content` prefix. Consolidating keeps the pattern consistent and avoids adding a third `<style>` tag. Scoped styles cannot reach `v-html` content.

**Alternative considered**: A separate `.css` file imported in the component. Rejected — adds a file with no benefit; the existing pattern already works.

### 2. Heading scale: full h1–h6 range

**Decision**: Style all six heading levels with distinct sizes (h1: 2em, h2: 1.5em, h3: 1.25em, h4: 1.1em, h5: 1em bold, h6: 0.9em bold).

**Rationale**: Unlike `NcRichText` (which shifts headings down to avoid competing with page structure), the org viewer renders a standalone document where heading semantics should be preserved at natural sizes. The `.org-viewer__content` prefix scopes them safely.

### 3. dl/dt/dd: term-bold + indented description

**Decision**: `dt` → `font-weight: bold`, `dd` → `margin-inline-start: 2ch`, both get `margin-block-end: 0.25em`.

**Rationale**: Standard definition list convention. The `margin-inline-start` uses a logical property for RTL compatibility. `2ch` aligns visually with the `4ch` list indentation.

### 4. Todo keyword coloring: Nextcloud semantic variables

**Decision**:
- `TODO`, `FIXME` → `--color-warning` (orange)
- `DONE` → `--color-success` (green)
- All others (WAIT, HOLD, CANCELLED, etc.) → `--color-text-maxcontrast` (muted)

**Rationale**: Leverages existing Nextcloud semantic colors that adapt to light/dark themes. Using a `span.todo-keyword` base style plus class-specific overrides covers known keywords while falling back gracefully for custom ones.

### 5. Tags: badge style using background-dark

**Decision**: `span.tag` gets `background: var(--color-background-dark)`, `border-radius: var(--border-radius)`, small padding, `font-size: 0.85em`.

**Rationale**: Visually separates tags from body text without introducing new colors. Matches common badge patterns in Nextcloud UI.

### 6. Logical CSS properties for directionality

**Decision**: Use `padding-inline-start`, `border-inline-start`, `margin-inline-start` throughout (matching NcRichText).

**Rationale**: Nextcloud supports RTL locales; logical properties handle both directions automatically.

## Risks / Trade-offs

- **Class name collision**: The `.tag`, `.priority`, `.todo-keyword` selectors under `.org-viewer__content` are specific enough to avoid collisions, but any future Nextcloud component injected into the viewer that uses those class names could be unintentionally styled. → Low risk; the `.org-viewer__content` prefix provides sufficient isolation.
- **uniorg-rehype output changes**: If a future uniorg-rehype version changes element class names (e.g. `src-block`, `inline-code`), styles silently stop applying. → Accept for now; no mitigation needed at this scale.
- **Non-scoped style bleed**: All non-scoped styles with `.org-viewer__content` prefix only apply inside that element. As long as that prefix is always present, bleed is contained. → Maintain the prefix discipline.
