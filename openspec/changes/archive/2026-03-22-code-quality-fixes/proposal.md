## Why

A code review identified security vulnerabilities (path traversal, potential XSS), a crash-prone null dereference in the DI bootstrap, and several readability issues (duplicated rendering pipeline, Options API inconsistency, empty stubs, naming mismatches). These should be fixed before the app grows further.

## What Changes

- **Security**: Restrict `getFile`/`putFile` to paths under `/Notes/` (mirrors `listFiles` behaviour)
- **Security**: Add URL scheme validation in the org link handler to block `javascript:` and other dangerous schemes
- **Security**: Guard `getUser()` null in `Application.php` to prevent crash when no session exists
- **Refactor**: Extract shared org rendering pipeline into `src/lib/renderOrg.js` to eliminate duplication between `OrgView.vue` and `OrgViewHandler.js`
- **Refactor**: Convert `OrgView.vue` from Options API to Composition API for consistency
- **Cleanup**: Remove empty JSDoc stubs in `OrgFile.vue`
- **Cleanup**: Align `Sidebar.vue` component `name` with filename (`OrgSidebar` → `Sidebar`)
- **Cleanup**: Fix import ordering in `OrgViewHandler.js` (group all imports before side effects)
- **Cleanup**: Simplify `listFiles` header reading (remove `fopen`/fallback pattern, use `getContent()` directly)

## Capabilities

### New Capabilities

*(none — this change is fixes and refactoring only)*

### Modified Capabilities

- `org-files-api`: `getFile` and `putFile` now reject paths outside `/Notes/` with 403
- `org-viewer`: Link handler now validates URL schemes; rendering pipeline extracted to shared module

## Impact

- `lib/Controller/OrgController.php` — path validation added to `getFile` and `putFile`
- `lib/AppInfo/Application.php` — null guard on `getUser()`
- `src/views/OrgView.vue` — rewritten to Composition API, delegates rendering to shared lib
- `src/views/OrgViewHandler.js` — delegates rendering to shared lib, imports reordered
- `src/lib/renderOrg.js` — new shared module (extracted from both view files)
- `src/components/OrgFile.vue` — empty JSDoc stubs removed
- `src/components/Sidebar.vue` — component name corrected
