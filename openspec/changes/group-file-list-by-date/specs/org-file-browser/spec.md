## MODIFIED Requirements

### Requirement: Sidebar sort by name or last modified
The sidebar SHALL provide a sort control with the following options: name ascending, name descending, last modified newest first, last modified oldest first. Name-based sorts SHALL compare by title when available, falling back to filename. The sort SHALL apply to the filtered list. The default sort SHALL be last modified newest first. When a date-based sort is active, the file list SHALL be grouped by time period as defined in the `file-list-date-grouping` capability. When a name-based sort is active, the file list SHALL render as a flat list.

#### Scenario: Sort by name ascending uses title
- **WHEN** the user selects "Name A→Z" and some files have titles
- **THEN** files with titles are ordered alphabetically by title, files without titles sort by filename

#### Scenario: Sort by last modified descending (default)
- **WHEN** the page loads with no explicit sort selected
- **THEN** files are ordered by mtime, most recently modified first

#### Scenario: Date sort activates grouping
- **WHEN** the user selects a date-based sort order
- **THEN** the file list is rendered with time-period group headers

#### Scenario: Name sort shows flat list
- **WHEN** the user selects a name-based sort order
- **THEN** the file list is rendered as a flat list without group headers
