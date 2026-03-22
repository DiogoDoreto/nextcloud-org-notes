## Why

The app can view `.org` files but has no way to edit them. Users who want to make changes must leave the app and edit files externally. Adding an edit mode with a proper code editor makes the standalone app a usable notes tool.

## What Changes

- The `OrgView` component is refactored into a pure renderer (takes raw content string, no fetching)
- A new `OrgFile` component handles fetching, saving, mode toggling, and dirty state — including its own sticky header with Edit/Save/Cancel actions
- A new `OrgEditor` component wraps CodeMirror 6 with a formatting toolbar for common org markup (bold, italic, verbatim, code, headings)
- `App.vue` is simplified to delegate all file content concerns to `OrgFile`
- A new `PUT /api/v1/file` backend endpoint saves updated file content
- Navigation away from unsaved changes is guarded with a confirmation prompt

## Capabilities

### New Capabilities

- `file-editing`: In-app editing of `.org` files with a CodeMirror 6 editor, org formatting toolbar, save/cancel actions, and unsaved-changes guard

### Modified Capabilities

- (none — view-only rendering behavior is unchanged)

## Impact

- **Frontend**: `OrgView.vue` refactored; new `OrgFile.vue`, `OrgEditor.vue`; `App.vue` simplified
- **Backend**: New `putFile()` method on `OrgController`, new route registered
- **Dependencies**: `codemirror`, `vue-codemirror`, `@codemirror/commands`, `@codemirror/state`, `@codemirror/view` added to `app/package.json`
