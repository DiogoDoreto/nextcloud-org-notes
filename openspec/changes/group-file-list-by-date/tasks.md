## 1. Grouping logic in Sidebar.vue

- [x] 1.1 Add a `fileGroups` computed property that buckets `sortedFiles` into `{ label, files }` groups using the priority order: Today → Yesterday → This week → This month → monthly
- [x] 1.2 Implement bucket boundary helpers: `startOfToday`, `startOfYesterday`, `startOfWeek` (Monday 00:00 local), `startOfMonth`
- [x] 1.3 Implement monthly label formatter: month name only for current year, `Month YYYY` for past years
- [x] 1.4 Ensure groups are emitted newest-first for `mtime-desc` and oldest-first for `mtime-asc`
- [x] 1.5 Filter out empty groups before returning from the computed

## 2. Template update in Sidebar.vue

- [x] 2.1 Replace the single `<FileList :files="sortedFiles" />` in the `#list` slot with a conditional: grouped rendering when sort is date-based, flat `FileList` when name-based
- [x] 2.2 Render each group as a section header element followed by `<FileList :files="group.files" />`
- [x] 2.3 Style the group header (size, colour, spacing) to match the Nextcloud sidebar aesthetic using CSS custom properties
