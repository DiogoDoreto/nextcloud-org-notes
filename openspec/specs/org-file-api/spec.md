# org-file-api

## Purpose

The OCS endpoint that returns the raw text content of a single `.org` file from the authenticated user's storage.

## Requirements

### Requirement: OCS endpoint returns .org file content
The app SHALL expose a `GET /ocs/v2.php/apps/orgnotes/api/v1/file` endpoint that accepts a `path` query parameter and returns the raw text content of the corresponding file from the authenticated user's storage. The endpoint SHALL be annotated `@NoAdminRequired` and SHALL NOT require CSRF tokens (OCS framework handles this).

#### Scenario: Authenticated user fetches an existing file
- **WHEN** an authenticated user sends `GET /ocs/v2.php/apps/orgnotes/api/v1/file?path=notes.org`
- **THEN** the response is HTTP 200 with OCS JSON containing `{ "ocs": { "data": { "content": "<raw org text>" } } }`

#### Scenario: File does not exist
- **WHEN** an authenticated user requests a path that does not exist in their storage
- **THEN** the endpoint returns an OCS error response with HTTP 404

### Requirement: File access is scoped to the authenticated user's storage
The `OrgController` SHALL resolve paths exclusively through `IRootFolder::getUserFolder($userId)`. It SHALL NOT accept absolute server paths, perform directory traversal, or access files outside the user's home folder. Path resolution is delegated entirely to `IRootFolder::get()`.

#### Scenario: Path is confined to the user's storage
- **WHEN** `getFile('../../etc/passwd')` or any traversal path is passed
- **THEN** `IRootFolder::get()` throws `NotFoundException` and the endpoint returns an OCS 404 error — no file outside the user folder is returned
