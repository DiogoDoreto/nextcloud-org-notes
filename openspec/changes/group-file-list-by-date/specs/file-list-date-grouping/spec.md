## ADDED Requirements

### Requirement: Files grouped by time period when sorted by date
When the sidebar sort order is last-modified (newest-first or oldest-first), the file list SHALL be divided into named time-period sections rather than rendered as a flat list. Each section header SHALL label its group. Empty groups SHALL be omitted entirely.

#### Scenario: Groups appear for date sort
- **WHEN** the user selects "Modified newest" or "Modified oldest" sort order
- **THEN** the file list renders section headers separating files into time-period groups

#### Scenario: No groups for name sort
- **WHEN** the user selects "Name A→Z" or "Name Z→A" sort order
- **THEN** the file list renders as a flat list with no section headers

#### Scenario: Empty groups are hidden
- **WHEN** a time-period group contains no files
- **THEN** that group's header is not rendered

### Requirement: Time-period bucket definitions
Files SHALL be assigned to exactly one bucket using the following priority (highest priority first). All boundaries use the user's local calendar.

- **Today**: `mtime` falls on today's calendar date
- **Yesterday**: `mtime` falls on yesterday's calendar date
- **This week**: `mtime` falls within the current calendar week (Monday 00:00 through yesterday 00:00), exclusive of Today and Yesterday
- **This month**: `mtime` falls within the current calendar month (1st 00:00 through Monday 00:00 of this week), exclusive of the above groups
- **Monthly**: all remaining files, one group per calendar month

#### Scenario: File modified today goes to Today
- **WHEN** a file's mtime is within today's calendar date (local time)
- **THEN** it appears under the "Today" group

#### Scenario: File modified yesterday goes to Yesterday
- **WHEN** a file's mtime falls on yesterday's calendar date
- **THEN** it appears under the "Yesterday" group

#### Scenario: File modified earlier this week (not today/yesterday) goes to This week
- **WHEN** a file's mtime is within Monday 00:00 through yesterday 00:00 of the current week
- **THEN** it appears under the "This week" group

#### Scenario: File modified earlier this month (before this week) goes to This month
- **WHEN** a file's mtime is within the current month but before the start of this week
- **THEN** it appears under the "This month" group

#### Scenario: File modified in a prior month goes to a monthly group
- **WHEN** a file's mtime is in a calendar month before the current month
- **THEN** it appears under a group labelled for that month

### Requirement: Monthly group label format
Monthly group labels (for files older than the current month) SHALL use the month name only when the group's year matches the current year (e.g. `"February"`). When the year differs from the current year the label SHALL include the year (e.g. `"December 2025"`).

#### Scenario: Current-year month shows name only
- **WHEN** a monthly group's year equals the current year
- **THEN** the label is the full month name (e.g. "February")

#### Scenario: Past-year month shows name and year
- **WHEN** a monthly group's year is before the current year
- **THEN** the label is the full month name followed by the four-digit year (e.g. "December 2025")

### Requirement: Group order follows sort direction
For newest-first sort, groups SHALL appear from most-recent to oldest: Today, Yesterday, This week, This month, then monthly groups in descending order. For oldest-first sort, the order SHALL reverse: oldest monthly group first, ascending through This month, This week, Yesterday, Today.

#### Scenario: Newest-first order
- **WHEN** sort is "Modified newest"
- **THEN** Today appears first, followed by Yesterday, This week, This month, then monthly groups newest-to-oldest

#### Scenario: Oldest-first order
- **WHEN** sort is "Modified oldest"
- **THEN** the oldest monthly group appears first, with Today appearing last

### Requirement: Groups remain visible during search
When a search query is active, grouping SHALL still apply. Files matching the search are placed into their respective time-period groups; empty groups resulting from filtering are hidden as normal.

#### Scenario: Searching with date sort retains group headers
- **WHEN** the user has a search query active and the sort order is date-based
- **THEN** matching files are still rendered within their time-period group headers
