## ADDED Requirements

### Requirement: File endpoints restrict access to Notes/ directory
The `getFile` and `putFile` OCS endpoints SHALL reject any request whose `path` parameter does not begin with `/Notes/`. A rejected request SHALL return HTTP 403 with an empty data payload. This matches the restriction already enforced by the `listFiles` endpoint and prevents path traversal outside the Notes directory.

#### Scenario: getFile rejects path outside Notes/
- **WHEN** a GET request is made to the file endpoint with `path=/private.txt`
- **THEN** the response is HTTP 403 and no file content is returned

#### Scenario: putFile rejects path outside Notes/
- **WHEN** a PUT request is made to the file endpoint with `path=/private.txt` and a content body
- **THEN** the response is HTTP 403 and the file is not modified

#### Scenario: getFile accepts path inside Notes/
- **WHEN** a GET request is made to the file endpoint with `path=/Notes/example.org`
- **THEN** the response returns the file content normally

#### Scenario: putFile accepts path inside Notes/
- **WHEN** a PUT request is made to the file endpoint with `path=/Notes/example.org` and valid content
- **THEN** the file is updated and the response is HTTP 200
