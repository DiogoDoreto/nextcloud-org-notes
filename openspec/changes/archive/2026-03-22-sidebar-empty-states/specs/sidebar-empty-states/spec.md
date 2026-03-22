## ADDED Requirements

### Requirement: Sidebar shows loading indicator while files are fetched
The sidebar SHALL display an animated loading indicator in the file list area while the initial file list is being loaded from the API. The loading indicator SHALL be visible until the API response is received, regardless of the result.

#### Scenario: Files are loading
- **WHEN** the app mounts and the files API request is in flight
- **THEN** the sidebar list area SHALL display a loading spinner instead of the file list or any empty state message

#### Scenario: Loading completes
- **WHEN** the API response is received
- **THEN** the loading spinner SHALL be replaced by the appropriate content (file list or empty state)

### Requirement: Sidebar shows contextual message when no org files exist
When loading is complete and the notes folder contains no org files, the sidebar SHALL display a message informing the user that no files were found and directing them to the Settings button to configure the notes folder.

#### Scenario: Notes folder is empty after loading
- **WHEN** loading completes and the files list is empty
- **THEN** the sidebar SHALL display a message indicating no org files were found in the notes folder
- **THEN** the message SHALL reference the Settings button as the way to configure the folder

### Requirement: Sidebar shows message when filter returns no results
When the notes folder contains org files but the active search filter matches none of them, the sidebar SHALL display a message indicating that no files match the current filter.

#### Scenario: Filter eliminates all results
- **WHEN** the user has typed a filter query and no files match it
- **THEN** the sidebar SHALL display a message indicating no files match the filter
- **THEN** the file list SHALL NOT be rendered

### Requirement: FileList does not render a generic empty message
The `FileList` component SHALL NOT display any fallback empty message. Empty state responsibility belongs exclusively to `OrgSidebar`.

#### Scenario: FileList receives an empty array
- **WHEN** the `FileList` component is given an empty `files` prop
- **THEN** it SHALL render nothing (no text, no placeholder)
