## Context

The app scaffold exists with Vue 3, Vite, and a basic `PageController`. No MIME type registration, no viewer integration, no API, and no frontend logic are in place. Nextcloud's Viewer framework handles file preview modals — apps register handlers for specific MIME types and provide a Vue component that receives `path` and `mime` as props.

## Goals / Non-Goals

**Goals:**
- `.org` files open in the Nextcloud Viewer as formatted HTML
- Full Org syntax coverage: headings, inline markup, tables, code blocks, TODO keywords, timestamps, links
- Syntax highlighting that adapts to Nextcloud's dark/light theme via CSS custom properties
- File access scoped to the authenticated user's storage via `IRootFolder`

**Non-Goals:**
- Editing or saving files
- Agenda / cross-file TODO aggregation
- App Store publishing
- Mobile / narrow viewport optimization

## Decisions

### OCS over plain REST for the file API

Nextcloud has two API conventions. OCS (`/ocs/v2.php/apps/...`) is the platform standard for data endpoints and handles CSRF automatically via the framework. Plain REST is simpler to configure but requires manual CSRF handling and deviates from Nextcloud conventions. `OrgController` extends `OCSController`.

### uniorg over orga for Org parsing

Both integrate with the unified/rehype ecosystem. uniorg draws directly from `org-element.el` and is the more spec-faithful parser — it handles edge cases (indented lists, drawer boundaries, property drawers) closer to how Emacs does. orga has a slightly larger example ecosystem but lower fidelity. uniorg is the right default for a first-party-accurate experience; orga remains an option if uniorg gaps emerge.

### CSS custom properties for syntax highlight theming

`rehype-highlight` adds standard highlight.js CSS classes (`.hljs-keyword`, `.hljs-string`, etc.). The alternative is importing a pre-built highlight.js theme (e.g. `github.css`), which hardcodes colors for one appearance mode. Instead, we map `.hljs-*` classes directly to Nextcloud CSS custom properties (`--color-primary`, `--color-text-maxcontrast`, `--color-background-dark`, etc.). Because Nextcloud re-applies its CSS vars when the user switches theme, highlighting updates automatically with no JavaScript.

### View-only for M1

A raw-text edit mode adds complexity (save endpoint, textarea/CodeMirror, conflict handling) that is out of proportion with M1's goal of proving the viewer works. Deferred to M2.

## Risks / Trade-offs

- **uniorg parsing gaps** → Complex Org files (nested drawers, exotic list continuations) may render imperfectly. Acceptable for M1; file issues upstream as discovered.
- **Nextcloud CSS var availability** → Some semantic vars (e.g. `--color-success`, `--color-warning`) may not exist in all NC 29.x releases. Mitigation: use fallback values (`var(--color-success, #46ba61)`) for tokens that map to non-core vars.
- **IRootFolder path traversal** → `getUserFolder()->get($path)` rejects paths that escape the user folder with `NotFoundException`. No additional sanitization needed, but this behavior must be verified during implementation.

## Open Questions

(none — all blocking decisions are resolved above)
