## Why

The sidebar footer settings button is visually understated (icon-only), making it hard to discover. The main content area shows "Select a file" at the top of the container rather than vertically centered, which looks unpolished on large screens.

## What Changes

- The settings button in the sidebar footer becomes full-width with the label "Org Notes settings"
- The "Select a file" empty state is vertically centered within the app content area
- The app icon is added to the "Select a file" empty state for visual identity

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `nextcloud-vue-ui`: The sidebar footer layout and the empty content presentation change visually.

## Impact

- `src/components/OrgSidebar.vue`: settings button and footer styles
- `src/App.vue`: empty content wrapper layout
