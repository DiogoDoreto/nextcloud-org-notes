## MODIFIED Requirements

### Requirement: Sidebar lists .org files under Notes/
The sidebar SHALL display all `.org` files found recursively under the `Notes/` folder in the authenticated user's storage. Each item SHALL show the file's title if one is available, falling back to the filename when `title` is null. The list SHALL be fetched from the files API on page load.

#### Scenario: Files with titles show title in sidebar
- **WHEN** the browser page loads and a file has a non-null `title`
- **THEN** the sidebar item displays the title, not the filename

#### Scenario: Files without titles show filename in sidebar
- **WHEN** a file has a null `title`
- **THEN** the sidebar item displays the filename as before

#### Scenario: Empty state when no files found
- **WHEN** the user has no `.org` files under `Notes/` (or the folder does not exist)
- **THEN** the sidebar shows an empty state message rather than an error

### Requirement: Sidebar filter by title or filename
The sidebar SHALL include a text input that filters the displayed file list to items whose title (or filename when title is null) contains the entered string (case-insensitive). Filtering SHALL be debounced (at least 150 ms) to avoid excessive re-renders while typing. The full list SHALL be restored when the input is cleared.

#### Scenario: Filter matches on title
- **WHEN** the user types "meeting" into the filter input and a file has title "Meeting Notes"
- **THEN** that file is included in the filtered results

#### Scenario: Filter matches on filename when title is absent
- **WHEN** the user types "todo" into the filter input and a file has no title but filename "todo.org"
- **THEN** that file is included in the filtered results

#### Scenario: Clearing filter restores full list
- **WHEN** the user clears the filter input
- **THEN** all files are shown again

### Requirement: Sidebar sort by name or last modified
The sidebar SHALL provide a sort control with the following options: name ascending, name descending, last modified newest first, last modified oldest first. Name-based sorts SHALL compare by title when available, falling back to filename. The sort SHALL apply to the filtered list. The default sort SHALL be last modified newest first.

#### Scenario: Sort by name ascending uses title
- **WHEN** the user selects "Name A→Z" and some files have titles
- **THEN** files with titles are ordered alphabetically by title, files without titles sort by filename

#### Scenario: Sort by last modified descending (default)
- **WHEN** the page loads with no explicit sort selected
- **THEN** files are ordered by mtime, most recently modified first
