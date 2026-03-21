## Why

The org file viewer renders HTML via `v-html` but has no content styles beyond syntax highlighting. Headings, paragraphs, lists, blockquotes, tables, definition lists, and org-specific elements (todo keywords, tags, verse/example/center blocks) render as unstyled browser defaults, which looks inconsistent with the Nextcloud UI.

## What Changes

- Add CSS for all HTML elements produced by `uniorg-rehype` inside `.org-viewer__content`
- Style typography baseline: `line-height`, `overflow-wrap`, `tab-size`
- Style block elements: `h1`–`h6`, `p`, `ul`, `ol`, `dl`/`dt`/`dd`, `blockquote`, `pre.verse`, `div.example`, `div.center`, `hr`, `table`, `div.footnote-definition`
- Style inline elements: `a`, `img`, `code.inline-code`, `code.inline-verbatim`
- Style org-specific spans: `span.todo-keyword` (color-coded by keyword), `span.tag` (badge), `span.priority`
- All styles use Nextcloud CSS custom properties (`--color-*`, `--border-radius`, etc.) for theme compatibility

## Capabilities

### New Capabilities

- `org-content-styles`: Visual styling for all HTML elements rendered inside the org viewer content area

### Modified Capabilities

<!-- none -->

## Impact

- `app/src/views/OrgView.vue`: non-scoped `<style>` block gains content rules
- No new dependencies
- No API changes
