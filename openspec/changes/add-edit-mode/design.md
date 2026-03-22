## Context

The standalone app currently renders `.org` files as read-only HTML. `OrgView.vue` does two things: fetches raw content from the API and parses/renders it as HTML. There is no write endpoint on the backend.

The Nextcloud Viewer modal uses a separate `OrgViewHandler.js` (Vue 2.7 render function) — this change is scoped to the standalone app only. The modal is a follow-on concern.

## Goals / Non-Goals

**Goals:**
- Toggle between view and edit mode for the selected file
- Edit raw org text in a CodeMirror 6 editor
- Formatting toolbar for common org markup (bold, italic, verbatim, code, heading promote/demote)
- Save changes back to the file via a new PUT endpoint
- Warn before navigating away with unsaved changes

**Non-Goals:**
- Org-mode syntax highlighting in the editor (no CM6 org language package exists; plain text editor is sufficient for now)
- Edit mode in the Nextcloud Viewer modal
- Conflict detection / concurrent edit handling
- Auto-save / draft storage
- New file creation or file deletion

## Decisions

### 1. New `OrgFile` component owns the file lifecycle

**Decision**: Extract a new `OrgFile.vue` component that owns fetching, saving, mode state, dirty tracking, and its own sticky header. `App.vue` passes only `path` and `id-map`.

**Alternatives considered**:
- Keep edit state in `App.vue` — rejected because `App.vue` would then own both layout and data concerns; awkward cross-component coupling via template refs.
- Push mode toggle into `OrgView` — rejected because `OrgView` currently does no saving; conflates rendering with data lifecycle.

**Rationale**: Self-contained component with one job (manage one file's content lifecycle). `App.vue` stays a pure layout shell.

### 2. `OrgView` becomes a pure renderer

**Decision**: Refactor `OrgView.vue` to accept a `content` string prop instead of fetching itself. No API calls inside `OrgView`.

**Rationale**: `OrgFile` already has the raw content; passing it down avoids a redundant fetch and makes `OrgView` reusable as a pure display component.

### 3. CodeMirror 6 via `vue-codemirror`, no org language mode

**Decision**: Use `codemirror` (v6 meta package) + `vue-codemirror` for Vue 3 integration. No syntax highlighting language — plain text editor.

**Alternatives considered**:
- WYSIWYG editors (TipTap, Milkdown) — rejected because they output HTML/Markdown; conversion to org format would be lossy for org-specific constructs (drawers, planning lines, keywords).
- Plain `<textarea>` — rejected in favor of CodeMirror for undo history, keyboard shortcuts, and line number support.
- Org syntax highlighting — no CM6 org-mode package exists on npm; not worth building from scratch as part of this change.

### 4. Formatting toolbar using `NcButton` from `@nextcloud/vue`

**Decision**: Build a thin toolbar above the CodeMirror editor using `NcButton`. Each button dispatches a CM6 `StateCommand` that wraps the current selection in org markup.

**Rationale**: Keeps the UI consistent with the Nextcloud design system. Toolbar commands are simple text-wrapping operations — no need for a third-party toolbar library.

**Supported operations**: `*bold*`, `/italic/`, `=verbatim=`, `~code~`, heading promote (`*` → `**`), heading demote (`**` → `*`).

### 5. Unsaved-changes guard via `onBeforeRouteLeave`

**Decision**: Use Vue Router 4's `onBeforeRouteLeave` composable inside `OrgFile` to intercept navigation when there are unsaved changes. Show a native `confirm()` dialog.

**Alternatives considered**:
- Watch the `path` prop and revert route on cancel — rejected because the route has already changed by the time the watcher fires; `onBeforeRouteLeave` intercepts before the transition.

### 6. PUT endpoint: `putFile(path, content)`

**Decision**: Add a `putFile` OCS action on `OrgController` accepting `path` (query param) and `content` (request body). Uses `IFile::putContent()`. Checks `isUpdateable()` before writing; returns 403 if not.

**Request**: `PUT /ocs/v2.php/apps/orgnotes/api/v1/file?path=...&format=json` with JSON body `{ "content": "..." }`.

## Risks / Trade-offs

- **Large file performance**: CodeMirror handles large files well, but the org → HTML re-render on save is synchronous. For very large files this could cause a brief UI freeze. → Acceptable for the initial implementation; can debounce or defer rendering if needed.
- **Concurrent edits**: No conflict detection. If the file is modified externally while the user is editing, the save will silently overwrite. → Acceptable for a single-user notes app; revisit if sharing/collaboration is added.
- **Plain text editor UX**: Without org syntax highlighting, the editor looks like a plain textarea. Users lose visual structure cues. → Mitigated by the formatting toolbar; syntax highlighting is a clear follow-on task once a CM6 org language package exists or is built.

## Open Questions

- Should the editor font be monospace (natural for raw text editing) or inherit the app's default? Lean toward monospace.
- Should line numbers be shown in the editor? Useful for debugging org structure; low cost to include.
