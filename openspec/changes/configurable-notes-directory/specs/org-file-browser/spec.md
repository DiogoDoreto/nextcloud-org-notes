## MODIFIED Requirements

### Requirement: Sidebar lists .org files under configured directory
The sidebar SHALL display all `.org` files found recursively under the user's configured org files root directory in the authenticated user's storage. Each item SHALL show the file's title if one is available, falling back to the filename when `title` is null. The list SHALL be fetched from the files API on page load.

#### Scenario: Files with titles show title in sidebar
- **WHEN** the browser page loads and a file has a non-null `title`
- **THEN** the sidebar item displays the title, not the filename

#### Scenario: Files without titles show filename in sidebar
- **WHEN** a file has a null `title`
- **THEN** the sidebar item displays the filename as before

#### Scenario: Empty state when no files found
- **WHEN** the user has no `.org` files under their configured directory (or the folder does not exist)
- **THEN** the sidebar shows an empty state message rather than an error

## ADDED Requirements

### Requirement: Sidebar has a settings button at the bottom
The sidebar SHALL display a settings icon button fixed at the bottom of the sidebar panel. The button SHALL follow the standard Nextcloud app convention for accessing personal settings. Clicking it SHALL navigate the user to the orgnotes section of the Nextcloud personal settings page.

#### Scenario: Settings button is visible in the sidebar
- **WHEN** the user opens the org file browser
- **THEN** a settings icon button is visible at the bottom of the sidebar

#### Scenario: Settings button navigates to personal settings
- **WHEN** the user clicks the settings button
- **THEN** the browser navigates to the orgnotes section of the Nextcloud personal settings page
