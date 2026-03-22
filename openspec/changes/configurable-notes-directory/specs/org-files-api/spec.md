## MODIFIED Requirements

### Requirement: Files listing endpoint
The app SHALL expose an OCS endpoint `GET /ocs/v2.php/apps/orgnotes/api/v1/files` that returns all `.org` files found recursively under the user's configured org files root directory in the authenticated user's storage. The endpoint SHALL require authentication (`@NoAdminRequired`) and SHALL NOT require CSRF (`@NoCSRFRequired` is not needed — OCS handles this). Each file entry in the response SHALL include `path` (full path relative to user root), `name` (filename only), `mtime` (Unix timestamp of last modification), `title` (string or null — value of `#+TITLE:` from the file header), and `id` (string or null — value of `:ID:` from the file's properties drawer).

#### Scenario: Returns files under configured directory
- **WHEN** a GET request is made to the files endpoint and the user has `.org` files under their configured directory
- **THEN** the response contains an array of objects with `path`, `name`, `mtime`, `title`, and `id` for each file

#### Scenario: Returns empty array when no files found
- **WHEN** the user has no `.org` files under their configured directory or the folder does not exist
- **THEN** the response contains an empty array with a 200 status — not a 404

#### Scenario: Files outside configured directory are excluded
- **WHEN** the user has `.org` files in locations other than their configured root directory
- **THEN** those files are NOT included in the response

#### Scenario: title is null when #+TITLE is absent
- **WHEN** an org file has no `#+TITLE:` keyword in its header
- **THEN** the `title` field for that file is `null`

#### Scenario: id is null when :ID: is absent
- **WHEN** an org file has no `:ID:` property in its header
- **THEN** the `id` field for that file is `null`

### Requirement: File endpoints restrict access to configured directory
The `getFile` and `putFile` OCS endpoints SHALL reject any request whose path does not resolve to within the user's configured org files root directory. The check SHALL be performed on the normalised path returned by `getRelativePath()` after Nextcloud resolves the input — not on the raw input string — to prevent traversal via segments like `..`. A rejected request SHALL return HTTP 403 with an empty data payload. This matches the restriction already enforced by the `listFiles` endpoint.

#### Scenario: getFile rejects path outside configured directory
- **WHEN** a GET request is made to the file endpoint with a path outside the user's configured directory
- **THEN** the response is HTTP 403 and no file content is returned

#### Scenario: getFile rejects traversal path
- **WHEN** a GET request is made to the file endpoint with a path like `/org/../private.txt`
- **THEN** the response is HTTP 403 and no file content is returned

#### Scenario: putFile rejects path outside configured directory
- **WHEN** a PUT request is made to the file endpoint with a path outside the user's configured directory
- **THEN** the response is HTTP 403 and the file is not modified

#### Scenario: getFile accepts path inside configured directory
- **WHEN** a GET request is made to the file endpoint with a path inside the user's configured directory
- **THEN** the response returns the file content normally

#### Scenario: putFile accepts path inside configured directory
- **WHEN** a PUT request is made to the file endpoint with a path inside the user's configured directory and valid content
- **THEN** the file is updated and the response is HTTP 200

## MODIFIED Requirements

### Requirement: Files listing uses MIME-type search
The implementation SHALL use `IRootFolder::getUserFolder()->search()` with a MIME type filter for `text/org`, then filter results to paths beginning with the user's configured org files root directory. This leverages Nextcloud's file cache index and avoids full filesystem traversal.

#### Scenario: Search returns MIME-filtered results
- **WHEN** the endpoint is called
- **THEN** only files with MIME type `text/org` are considered, regardless of extension

## UNCHANGED Requirements

### Requirement: Response format
The endpoint SHALL return an OCS-formatted JSON response consistent with existing endpoints:
```json
{
  "ocs": {
    "meta": { "status": "ok", "statuscode": 200 },
    "data": [
      { "path": "/org/meeting.org", "name": "meeting.org", "mtime": 1710000000, "title": "Meeting Notes", "id": "20240101T120000.000000" },
      { "path": "/org/projects/todo.org", "name": "todo.org", "mtime": 1709900000, "title": null, "id": null }
    ]
  }
}
```

#### Scenario: Response structure matches OCS format
- **WHEN** the endpoint returns data
- **THEN** the response body has an `ocs.data` array with the file objects including `title` and `id` fields
