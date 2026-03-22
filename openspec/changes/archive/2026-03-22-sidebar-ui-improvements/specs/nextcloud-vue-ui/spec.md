## MODIFIED Requirements

### Requirement: Empty state uses NcEmptyContent
When no file is selected, the content area SHALL display `NcEmptyContent` instead of a plain paragraph.

The empty state SHALL be vertically centered within the full height of `NcAppContent`. This SHALL be achieved by wrapping `NcEmptyContent` in a flex container with `height: 100%`.

The empty state SHALL display the app icon inside `NcEmptyContent`'s `#icon` slot. The icon SHALL be rendered as an `<img>` element inside a circular container with `background-color: var(--color-primary)`, matching the Nextcloud app grid icon style.

#### Scenario: No file selected on initial load
- **WHEN** the app loads with no file query parameter
- **THEN** `NcEmptyContent` SHALL be shown in the content area with an appropriate heading and description

#### Scenario: Empty state is vertically centered
- **WHEN** no file is selected and the content area is taller than the empty state content
- **THEN** the empty state SHALL appear vertically centered within `NcAppContent`

#### Scenario: App icon is shown in the empty state
- **WHEN** no file is selected
- **THEN** the app icon SHALL be displayed above the heading inside the empty state

## MODIFIED Requirements

### Requirement: Settings button is full-width and labelled
The sidebar footer SHALL render a full-width `NcButton` labelled "Org Notes settings" (with a cog icon) that links to the Nextcloud personal settings page for the app.

The button SHALL use the `wide` prop to span the full footer width.

#### Scenario: Settings button is visible and labelled
- **WHEN** the sidebar is displayed
- **THEN** the footer SHALL show a full-width button with the text "Org Notes settings" and a cog icon

#### Scenario: Settings button navigates to settings
- **WHEN** the user clicks the settings button
- **THEN** the browser SHALL navigate to the Nextcloud personal settings page for the orgnotes app
