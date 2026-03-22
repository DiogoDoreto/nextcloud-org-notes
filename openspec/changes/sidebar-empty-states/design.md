## Context

The sidebar (`OrgSidebar.vue`) receives a `files` array prop from `App.vue`, which populates it after an async API call. Currently there is no loading indicator, and `FileList.vue` shows a generic "No files found." message regardless of whether the list is empty because no org files exist or because a search filter eliminated all results.

The sidebar already has access to `settingsUrl` and renders a settings button in its footer — the empty state for no files can reference this naturally.

`NcLoadingIcon` from `@nextcloud/vue` provides an accessible, theme-aware spinner suitable for the loading state.

## Goals / Non-Goals

**Goals:**
- Show a spinner in the sidebar list area while files are loading
- Show a contextual "no org files" message (with a nudge toward Settings) when the folder is empty
- Show a "no filter results" message when the search filter eliminates all files
- Remove the ambiguous generic empty message from `FileList`

**Non-Goals:**
- Fetching or displaying the configured folder name (too costly; Option C from exploration)
- Handling API errors (separate concern)
- Animating the transition between states

## Decisions

### Loading state owned by App.vue
`App.vue` initiates the fetch and is the authoritative source of loading status. A `loading` boolean ref is set `true` before the request and `false` in the `finally` block. It is passed as a prop to `OrgSidebar`.

Alternative considered: detect loading inside `OrgSidebar` by observing a sentinel value on `files`. Rejected — leaks protocol into the child component.

### Empty state rendering in OrgSidebar, not FileList
`OrgSidebar` is the only component that can distinguish the two empty scenarios: it holds both `props.files` (total) and `filteredFiles` (after search). `FileList` only receives its slice and cannot differentiate.

The empty states are rendered directly in the `#list` slot of `NcAppNavigation`, replacing the `FileList` render path when applicable.

### No folder name in empty state message
Displaying the configured folder name would require an additional API call (`GET /api/v1/settings`) that is not otherwise needed on initial load. The message instead says "your notes folder" and directs users to the Settings button, which is already present in the footer.

### State priority order
```
loading                          → spinner
!loading && files.length === 0   → "no org files" message
!loading && filtered.length === 0
         && files.length > 0     → "no filter results" message
otherwise                        → normal file list
```
Loading takes priority; the no-files check must only run after loading completes to avoid a flash of the empty state during the fetch.

## Risks / Trade-offs

- **Flash of empty content**: If `loading` is not set before the first render, the "no files" message could appear briefly. Mitigated by initialising `loading` as `true` in `App.vue`.
- **Filter debounce window**: There is a 150 ms debounce on the filter. During that window `filteredFiles` may briefly lag behind `filterQuery`. The empty-state logic reads `filteredFiles`, so it will update after the debounce — acceptable UX.
