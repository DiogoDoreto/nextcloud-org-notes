## ADDED Requirements

### Requirement: .org files are registered as a known MIME type
The app SHALL include `appinfo/mimetypemapping.json` mapping the `org` extension to `["text/org"]`, and `appinfo/mimetypealiases.json` mapping `text/org` to `"text"` for icon fallback. Both files SHALL be present in the app package so Nextcloud registers them on app install or MIME type repair.

#### Scenario: .org extension maps to text/org
- **WHEN** Nextcloud resolves the MIME type of a file with `.org` extension
- **THEN** it returns `text/org`

#### Scenario: Icon fallback is set to text
- **WHEN** Nextcloud renders the file icon for a `text/org` file and no dedicated icon is found
- **THEN** it falls back to the generic text file icon
