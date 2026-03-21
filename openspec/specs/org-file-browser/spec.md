# org-file-browser

## Purpose

The single-page app at `/apps/orgnotes/` that lets users browse, filter, sort, and read their `.org` files.

## Requirements

### Requirement: Navigation entry links to the browser page
The app SHALL register a navigation entry in `appinfo/info.xml` using a `<navigations>` block. The entry SHALL appear in Nextcloud's top header navigation bar and SHALL link to `/apps/orgnotes/`. The entry SHALL use the app's icon (`img/app.svg`) and SHALL be visible to any authenticated user with the app enabled.

#### Scenario: Navigation entry appears in header
- **WHEN** an authenticated user opens any Nextcloud page with the app enabled
- **THEN** an "Org Notes" entry is visible in the top navigation bar

#### Scenario: Navigation entry navigates to browser page
- **WHEN** the user clicks the "Org Notes" navigation entry
- **THEN** the browser navigates to `/apps/orgnotes/`

### Requirement: Browser page mounts a Vue app
The `GET /apps/orgnotes/` route SHALL render an HTML template that includes a `<div id="app">` mount point and loads `js/app.js`. The Vue app SHALL mount onto that element at page load.

#### Scenario: Browser page loads without error
- **WHEN** a user navigates to `/apps/orgnotes/`
- **THEN** the page renders with a sidebar and an empty main content area (no file selected)

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

### Requirement: Clicking a file displays it as main content
Clicking a file item in the sidebar SHALL navigate (Vue Router push) to `#/?file=<encoded-path>`, causing the main content area to render `OrgView` with that path. The selected item SHALL be visually highlighted in the sidebar.

#### Scenario: Clicking a file renders it
- **WHEN** the user clicks a file item in the sidebar
- **THEN** the main content area renders the file using OrgView and the item is highlighted

#### Scenario: Clicking a different file switches the view
- **WHEN** a file is already displayed and the user clicks a different item
- **THEN** OrgView loads and renders the newly selected file

### Requirement: Deep-linking via URL hash query param
The selected file SHALL be encoded in the URL as `#/?file=<path>`. On page load, if a `file` query param is present in the hash, the corresponding file SHALL be pre-selected and rendered. The browser back/forward buttons SHALL navigate between previously selected files.

#### Scenario: Direct link pre-selects a file
- **WHEN** the user opens `/apps/orgnotes/#/?file=/Notes/meeting.org`
- **THEN** `meeting.org` is highlighted in the sidebar and rendered in the main area

#### Scenario: Browser back navigates to previous file
- **WHEN** the user has navigated through multiple files and presses the browser back button
- **THEN** the previously viewed file is selected and rendered
