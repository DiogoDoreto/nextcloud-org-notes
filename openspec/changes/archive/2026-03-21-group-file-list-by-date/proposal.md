## Why

When a user has many org files, a flat sorted-by-date list makes it hard to locate files by approximate recency. Grouping by time period surfaces temporal context at a glance.

## What Changes

- The sidebar file list gains section headers when sorted by date (modified newest/oldest)
- Files are bucketed into: Today, Yesterday, This week, This month, and monthly groups for older files
- Monthly group labels show only the month name for the current year, and `Month YYYY` for prior years
- Empty groups are hidden
- Name-sorted views remain flat (no grouping)

## Capabilities

### New Capabilities

- `file-list-date-grouping`: Grouping of the sidebar file list into time-period sections when sorted by modified date

### Modified Capabilities

- `org-file-browser`: The sidebar file list gains grouped rendering behaviour when date-sorted

## Impact

- `app/src/components/Sidebar.vue` — new computed property for groups, updated template
- No backend changes, no new dependencies
