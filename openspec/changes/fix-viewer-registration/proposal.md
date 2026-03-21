## Why

Clicking a `.org` file in the Nextcloud Files app opens the built-in plain text preview instead of our viewer. `main.js` — which registers the `@nextcloud/viewer` handler — is never injected into the Files app page, so the handler never runs.

## What Changes

- `Application.php::boot()` listens for the Files app's `LoadAdditionalScriptsEvent` and injects `main.js` into the page at that point.

## Capabilities

### New Capabilities

_(none)_

### Modified Capabilities

- `org-viewer`: Add a requirement that `Application.php` injects `main.js` into the Files app page via the event dispatcher, so the viewer handler is registered before any file is clicked.

## Impact

- `app/lib/AppInfo/Application.php` — add event dispatcher listener in `boot()`
- No API, dependency, or frontend changes required
