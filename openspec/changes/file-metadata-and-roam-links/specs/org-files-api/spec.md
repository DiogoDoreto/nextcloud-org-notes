## MODIFIED Requirements

### Requirement: Files listing endpoint
The app SHALL expose an OCS endpoint `GET /ocs/v2.php/apps/orgnotes/api/v1/files` that returns all `.org` files found recursively under the `Notes/` folder in the authenticated user's storage. The endpoint SHALL require authentication (`@NoAdminRequired`) and SHALL NOT require CSRF (`@NoCSRFRequired` is not needed — OCS handles this). Each file entry in the response SHALL include `path` (full path relative to user root), `name` (filename only), `mtime` (Unix timestamp of last modification), `title` (string or null — value of `#+TITLE:` from the file header), and `id` (string or null — value of `:ID:` from the file's properties drawer).

#### Scenario: Returns files under Notes/
- **WHEN** a GET request is made to the files endpoint and the user has `.org` files under `Notes/`
- **THEN** the response contains an array of objects with `path`, `name`, `mtime`, `title`, and `id` for each file

#### Scenario: Returns empty array when no files found
- **WHEN** the user has no `.org` files under `Notes/` or the folder does not exist
- **THEN** the response contains an empty array with a 200 status — not a 404

#### Scenario: Files outside Notes/ are excluded
- **WHEN** the user has `.org` files in other locations (e.g., `/Documents/notes.org`)
- **THEN** those files are NOT included in the response

#### Scenario: title is null when #+TITLE is absent
- **WHEN** an org file has no `#+TITLE:` keyword in its header
- **THEN** the `title` field for that file is `null`

#### Scenario: id is null when :ID: is absent
- **WHEN** an org file has no `:ID:` property in its header
- **THEN** the `id` field for that file is `null`

### Requirement: Response format
The endpoint SHALL return an OCS-formatted JSON response consistent with existing endpoints:
```json
{
  "ocs": {
    "meta": { "status": "ok", "statuscode": 200 },
    "data": [
      { "path": "/Notes/meeting.org", "name": "meeting.org", "mtime": 1710000000, "title": "Meeting Notes", "id": "20240101T120000.000000" },
      { "path": "/Notes/projects/todo.org", "name": "todo.org", "mtime": 1709900000, "title": null, "id": null }
    ]
  }
}
```

#### Scenario: Response structure matches OCS format
- **WHEN** the endpoint returns data
- **THEN** the response body has an `ocs.data` array with the file objects including `title` and `id` fields
