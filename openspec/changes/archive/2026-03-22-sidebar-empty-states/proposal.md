## Why

The sidebar currently shows no message when there are no files to display, leaving the user without guidance. Two distinct empty scenarios need distinct feedback: when the configured notes folder contains no org files, and when the active search filter returns no results.

## What Changes

- Add a loading state to the sidebar while files are being fetched from the API
- Add an empty state for when no org files are found, explaining which folder is being scanned and directing the user to the Settings button to change it
- Add an empty state for when the active filter returns no results
- Remove the generic "No files found." message currently rendered inside `FileList`

## Capabilities

### New Capabilities
- `sidebar-empty-states`: Empty state messages and loading indicator in the org files sidebar

### Modified Capabilities

## Impact

- `src/App.vue`: add `loading` ref, pass it as prop to `OrgSidebar`
- `src/components/OrgSidebar.vue`: consume `loading` prop; render empty states in the `#list` slot
- `src/components/FileList.vue`: remove the generic empty message
