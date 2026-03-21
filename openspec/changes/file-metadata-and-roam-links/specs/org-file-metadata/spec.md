## ADDED Requirements

### Requirement: Extract title and ID from org file headers
The server SHALL extract `#+TITLE` and `:ID:` from each org file by reading at most the first 2048 bytes of the file. Extraction SHALL use `$file->fopen('r')` for streaming reads; if `fopen` returns false, the implementation SHALL fall back to `substr($file->getContent(), 0, 2048)`. The extracted `title` SHALL be the trimmed string value after `#+TITLE:` (case-insensitive match). The extracted `id` SHALL be the trimmed token after `:ID:` in a `:PROPERTIES:` drawer. Both fields SHALL be `null` when not found in the header region.

#### Scenario: File with #+TITLE yields title
- **WHEN** an org file contains `#+TITLE: Meeting Notes` near the top
- **THEN** the extracted title is `"Meeting Notes"`

#### Scenario: File with :ID: in properties drawer yields id
- **WHEN** an org file contains a `:PROPERTIES:` block with `:ID: 20240101T120000.000000` near the top
- **THEN** the extracted id is `"20240101T120000.000000"`

#### Scenario: File without #+TITLE yields null title
- **WHEN** an org file has no `#+TITLE:` keyword in the first 2048 bytes
- **THEN** the extracted title is `null`

#### Scenario: File without :ID: yields null id
- **WHEN** an org file has no `:ID:` entry in the first 2048 bytes
- **THEN** the extracted id is `null`

#### Scenario: ID beyond first 2048 bytes is not extracted
- **WHEN** an org file has `:ID:` only after position 2048
- **THEN** the extracted id is `null` (this is an accepted limitation)
