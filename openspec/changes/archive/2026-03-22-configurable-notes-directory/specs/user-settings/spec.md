## ADDED Requirements

### Requirement: User can configure org files root directory
The app SHALL allow each authenticated user to configure the root directory used to scope their org files. The setting SHALL be stored as a Nextcloud user preference (app: `orgnotes`, key: `notesDirectory`). The default value SHALL be `Notes`, preserving backwards compatibility for existing users. The stored value SHALL be a directory name relative to the user's own Nextcloud root (not a full path). The value SHALL NOT contain path separators (`/`) or parent-directory references (`..`), and SHALL NOT be empty.

#### Scenario: Default value is Notes
- **WHEN** a user has never configured a directory
- **THEN** the effective root directory is `Notes`

#### Scenario: User sets a custom directory
- **WHEN** the user saves `org` as their directory
- **THEN** subsequent API requests scope files to `/org/` instead of `/Notes/`

#### Scenario: Invalid value is rejected
- **WHEN** the user submits a value containing `/` or `..` or an empty string
- **THEN** the API returns HTTP 400 and the preference is not changed

### Requirement: Settings OCS API endpoints
The app SHALL expose two OCS endpoints for reading and writing the directory preference:
- `GET /ocs/v2.php/apps/orgnotes/api/v1/settings` — returns `{ "notesDirectory": "<value>" }`
- `PUT /ocs/v2.php/apps/orgnotes/api/v1/settings` — accepts `{ "notesDirectory": "<value>" }`, validates, and persists

Both endpoints SHALL require authentication (`@NoAdminRequired`).

#### Scenario: GET returns current value
- **WHEN** an authenticated user calls GET /api/v1/settings and has set `org`
- **THEN** the response contains `{ "notesDirectory": "org" }`

#### Scenario: GET returns default when unset
- **WHEN** an authenticated user calls GET /api/v1/settings and has never configured a value
- **THEN** the response contains `{ "notesDirectory": "Notes" }`

#### Scenario: PUT persists valid value
- **WHEN** an authenticated user calls PUT /api/v1/settings with `{ "notesDirectory": "my-org" }`
- **THEN** the preference is saved and subsequent GET returns `{ "notesDirectory": "my-org" }`

#### Scenario: PUT rejects invalid value
- **WHEN** an authenticated user calls PUT /api/v1/settings with `{ "notesDirectory": "../private" }`
- **THEN** the response is HTTP 400 and the preference is unchanged

### Requirement: Personal settings page
The app SHALL register a personal settings section in Nextcloud's personal settings area. The section SHALL contain a text input for the org files directory and a save button. The current configured value SHALL be loaded on page open. On save, the input value SHALL be validated and submitted to the settings API. Success and error states SHALL be communicated to the user.

#### Scenario: Settings page loads current value
- **WHEN** a user opens the personal settings page
- **THEN** the directory input shows the current configured value (or `Notes` if unset)

#### Scenario: Saving valid input updates the setting
- **WHEN** the user enters `org` and clicks Save
- **THEN** the setting is persisted and a success indicator is shown

#### Scenario: Saving invalid input shows an error
- **WHEN** the user enters `my/nested/dir` and clicks Save
- **THEN** an error message is shown and the setting is not saved
