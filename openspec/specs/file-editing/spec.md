## Purpose

In-app editing of `.org` files. Users can toggle between the rendered HTML view and a CodeMirror 6 text editor, apply common org markup via a formatting toolbar, save changes back to the server, and are protected from accidentally discarding unsaved changes.

## Requirements

### Requirement: User can toggle edit mode for the selected file
The app SHALL provide an Edit button in the file header that switches the content area from the rendered HTML view to a CodeMirror 6 text editor showing the raw org content.

#### Scenario: Entering edit mode
- **WHEN** a file is selected and the user clicks the Edit button
- **THEN** the rendered HTML view is replaced by a CodeMirror editor containing the raw org text
- **AND** the header shows Cancel and Save buttons in place of the Edit button

#### Scenario: Cancelling edit mode with no changes
- **WHEN** the user clicks Cancel without modifying the content
- **THEN** the editor is replaced by the rendered HTML view
- **AND** the header shows the Edit button again

#### Scenario: Cancelling edit mode with unsaved changes
- **WHEN** the user has modified the content and clicks Cancel
- **THEN** the system SHALL prompt the user to confirm discarding changes
- **AND** if the user confirms, the editor is replaced by the rendered HTML view with the original content
- **AND** if the user cancels the prompt, the editor remains open with the modified content

### Requirement: User can save changes to an org file
The app SHALL write the edited org content back to the file on the server when the user clicks Save.

#### Scenario: Successful save
- **WHEN** the user clicks Save
- **THEN** the system sends the updated content to the server via PUT /api/v1/file
- **AND** on success, the editor is replaced by the rendered HTML view showing the updated content
- **AND** the header returns to view mode showing the Edit button

#### Scenario: Save failure
- **WHEN** the server returns an error on save
- **THEN** the editor remains open
- **AND** an error message is shown to the user

### Requirement: Formatting toolbar for common org markup
The editor SHALL provide a toolbar with buttons that wrap the current selection in org markup.

#### Scenario: Applying bold markup
- **WHEN** the user selects text and clicks the Bold toolbar button
- **THEN** the selection is wrapped as `*selected text*`

#### Scenario: Applying italic markup
- **WHEN** the user selects text and clicks the Italic toolbar button
- **THEN** the selection is wrapped as `/selected text/`

#### Scenario: Applying verbatim markup
- **WHEN** the user selects text and clicks the Verbatim toolbar button
- **THEN** the selection is wrapped as `=selected text=`

#### Scenario: Applying code markup
- **WHEN** the user selects text and clicks the Code toolbar button
- **THEN** the selection is wrapped as `~selected text~`

### Requirement: Unsaved changes navigation guard
The app SHALL prevent accidental data loss when the user navigates to a different file while unsaved changes exist.

#### Scenario: Navigating away with unsaved changes
- **WHEN** the editor contains unsaved changes and the user selects a different file
- **THEN** the system SHALL prompt the user to confirm discarding changes before navigation proceeds
- **AND** if the user cancels, navigation is blocked and the current file remains open in edit mode

#### Scenario: Navigating away without unsaved changes
- **WHEN** no unsaved changes exist and the user selects a different file
- **THEN** navigation proceeds without a confirmation prompt

### Requirement: Backend write endpoint for org files
The server SHALL expose a PUT endpoint to overwrite an org file's content.

#### Scenario: Successful file write
- **WHEN** a PUT request is sent to /api/v1/file with a valid path and content
- **THEN** the file content is replaced with the provided content
- **AND** the server responds with HTTP 200

#### Scenario: Write to non-existent file
- **WHEN** a PUT request is sent with a path that does not exist
- **THEN** the server responds with HTTP 404

#### Scenario: Write to file without permission
- **WHEN** a PUT request is sent for a file the user cannot modify
- **THEN** the server responds with HTTP 403
