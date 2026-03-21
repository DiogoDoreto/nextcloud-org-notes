## Context

The sidebar file list in `Sidebar.vue` currently passes a flat sorted array to `FileList.vue`. When sorted by date, grouping by time period improves navigation. All files have an `mtime` Unix timestamp (seconds) from the PHP backend.

Current flow:
```
sortedFiles (Array<OrgFile>) → FileList.vue → FileItem × N
```

## Goals / Non-Goals

**Goals:**
- Render time-period section headers when sorted by `mtime-desc` or `mtime-asc`
- Bucket definitions: Today, Yesterday, This week (calendar Mon–Sun), This month, then monthly groups
- Monthly labels: `"March"` for current year, `"March 2025"` for past years
- Hide empty groups
- Show groups even when a search query is active

**Non-Goals:**
- Grouping for name-based sort orders
- Changes to `FileList.vue` or `FileItem.vue`
- Backend changes

## Decisions

**1. Grouping logic lives in `Sidebar.vue` as a computed property**

A `fileGroups` computed derives from `sortedFiles` when `sortOrder` is `mtime-desc` or `mtime-asc`. The template loops groups and renders a header + `FileList` per group.

Alternative considered: new `FileGroupList.vue` component. Rejected — the logic is tightly coupled to sort state already in `Sidebar.vue`, and the template change is small. Avoids an extra file for a contained concern.

**2. Calendar week (Mon–Sun), not rolling 7 days**

"This week" maps to Monday 00:00 of the current week through yesterday. More intuitive for users thinking about their work week.

**3. Bucket priority order**

Each file falls into exactly one bucket using earliest-match logic:

```
today     → mtime ≥ startOfToday
yesterday → mtime ≥ startOfYesterday
this week → mtime ≥ startOfWeek (Mon 00:00) && < startOfYesterday
this month→ mtime ≥ startOfMonth && < startOfWeek
past      → one bucket per calendar month (keyed by YYYY-MM)
```

"This month" and "This week" only show if their ranges are non-empty (e.g., if today is Monday, startOfWeek = startOfToday so "This week" range is empty).

**4. Group order for `mtime-asc`**

Groups are emitted oldest-first (monthly buckets ascending, then This month, This week, Yesterday, Today). The `sortedFiles` array is already ascending, so bucket assignment is the same; only the emission order reverses.

## Risks / Trade-offs

- **Clock skew / timezone**: `mtime` from the server is UTC; `Date` in the browser uses local time. "Today" boundaries will reflect the user's local clock, which is the expected behaviour.
- **Large file counts**: Grouping is a single-pass O(n) computed — negligible.
- **Sparse groups when searching**: A search returning 3 files across 3 months will show 3 headers. Acceptable; groups remain useful context.
