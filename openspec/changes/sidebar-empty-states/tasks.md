## 1. App.vue — loading state

- [ ] 1.1 Add a `loading` ref initialised to `true` in `App.vue`
- [ ] 1.2 Set `loading.value = false` in the `finally` block of the `onMounted` fetch
- [ ] 1.3 Pass `loading` as a prop to the `OrgSidebar` component

## 2. OrgSidebar — loading prop and empty states

- [ ] 2.1 Add a `loading` boolean prop to `OrgSidebar`
- [ ] 2.2 Import `NcLoadingIcon` from `@nextcloud/vue/components/NcLoadingIcon`
- [ ] 2.3 Replace the `#list` slot content with a `v-if/v-else-if/v-else` chain:
  - `loading` → render `NcLoadingIcon`
  - `!loading && props.files.length === 0` → render no-files empty state
  - `!loading && filteredFiles.length === 0` → render no-filter-results empty state
  - otherwise → render the existing grouped/flat `FileList` output
- [ ] 2.4 Write the no-files empty state message referencing the Settings button
- [ ] 2.5 Write the no-filter-results empty state message
- [ ] 2.6 Add scoped styles for the empty state messages (consistent with existing `.file-group__header` palette)

## 3. FileList — remove generic empty message

- [ ] 3.1 Remove the `v-if="files.length === 0"` paragraph and its associated `.file-list__empty` CSS rule from `FileList.vue`
