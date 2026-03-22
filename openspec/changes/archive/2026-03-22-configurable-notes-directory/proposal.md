## Why

The app currently hardcodes `/Notes/` as the root directory for org files. Nextcloud's native Notes app also operates on the `Notes/` folder and mangles org syntax when it encounters `.org` files there. Users need to store org files in a different directory to prevent interference.

## What Changes

- Users can configure a custom root directory for org files via a personal settings page
- The backend replaces the hardcoded `/Notes/` path with the user's configured value
- A new personal settings page is introduced (first settings surface in the app)
- The sidebar gets a settings button at the bottom, following standard Nextcloud app conventions
- Default value remains `Notes` for backwards compatibility

## Capabilities

### New Capabilities
- `user-settings`: Personal settings page where users can configure their org files root directory

### Modified Capabilities
- `org-files-api`: The `/Notes/` directory restriction becomes user-configurable rather than hardcoded
- `org-file-browser`: Sidebar gains a settings button at the bottom to access the personal settings page

## Impact

- `lib/Controller/OrgController.php` — replace hardcoded `/Notes/` with value from `IConfig`
- New personal settings PHP controller and Vue component
- New API endpoint for reading/writing the directory preference
- `src/components/OrgSidebar.vue` — add settings button at bottom
