## ADDED Requirements

### Requirement: App uses Nextcloud layout containers
The app SHALL wrap its root UI in `NcContent`, with navigation in `NcAppNavigation` and the file viewer in `NcAppContent`, matching Nextcloud's standard app layout contract.

#### Scenario: App renders with Nextcloud layout structure
- **WHEN** the org browser app is loaded
- **THEN** the page SHALL contain the standard Nextcloud navigation sidebar and content area provided by `NcContent` / `NcAppNavigation` / `NcAppContent`

#### Scenario: Sidebar is collapsible on mobile
- **WHEN** the viewport is narrow (mobile)
- **THEN** `NcAppNavigation` SHALL provide its built-in collapse behavior without custom CSS

### Requirement: File filtering uses NcAppNavigationSearch
The app SHALL use `NcAppNavigationSearch` for filtering the file list, replacing the custom `<input>` element.

#### Scenario: User types in the search field
- **WHEN** the user types a query into the navigation search field
- **THEN** the file list SHALL update to show only files whose names match the query (debounced, case-insensitive)

#### Scenario: Search field is cleared
- **WHEN** the user clears the search field
- **THEN** all files SHALL be shown

### Requirement: Sort order is controlled via NcActions menu
The app SHALL expose sort order selection through an `NcActions` button containing `NcActionRadioButton` options, replacing the native `<select>` element.

#### Scenario: Sort menu shows available options
- **WHEN** the user opens the sort actions menu
- **THEN** four options SHALL be shown: "Modified newest", "Modified oldest", "Name A→Z", "Name Z→A"

#### Scenario: Current sort is indicated
- **WHEN** the sort menu is open
- **THEN** the currently active sort option SHALL be marked as selected via the radio button state

#### Scenario: Selecting a sort option reorders the list
- **WHEN** the user selects a sort option
- **THEN** the file list SHALL immediately reorder according to the chosen sort

### Requirement: File list items use NcAppNavigationItem
Each file in the sidebar list SHALL be rendered as an `NcAppNavigationItem`, replacing the custom `<div>`-based file item.

#### Scenario: Active file is highlighted
- **WHEN** a file is selected (its path matches the current route query)
- **THEN** the corresponding `NcAppNavigationItem` SHALL reflect an active/selected visual state

#### Scenario: Clicking a file item opens it
- **WHEN** the user clicks an `NcAppNavigationItem`
- **THEN** the router SHALL navigate to that file's path and the org viewer SHALL render its content

### Requirement: Empty state uses NcEmptyContent
When no file is selected, the content area SHALL display `NcEmptyContent` instead of a plain paragraph.

#### Scenario: No file selected on initial load
- **WHEN** the app loads with no file query parameter
- **THEN** `NcEmptyContent` SHALL be shown in the content area with an appropriate heading and description

### Requirement: App targets Nextcloud 31 or later
The app's `appinfo/info.xml` SHALL declare `min-version` as 31 to reflect the `@nextcloud/vue` v9 requirement.

#### Scenario: Nextcloud version constraint is declared
- **WHEN** the app manifest is read by Nextcloud
- **THEN** the minimum version SHALL be 31
