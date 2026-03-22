## 1. Backend: Settings Storage & API

- [x] 1.1 Inject `IConfig` into `OrgController` and add a `getNotesDirectory()` helper that reads the `notesDirectory` user preference (default: `Notes`)
- [x] 1.2 Replace all three hardcoded `'/Notes/'` path checks in `OrgController` with the value from `getNotesDirectory()`
- [x] 1.3 Implement `GET /api/v1/settings` OCS action on `OrgController` returning `{ "notesDirectory": "<value>" }`
- [x] 1.4 Implement `PUT /api/v1/settings` OCS action on `OrgController` with input validation (reject empty, containing `/` or `..`) and persistence via `IConfig::setUserValue`
- [x] 1.5 Register the two new routes in `appinfo/routes.php`

## 2. Backend: Personal Settings Registration

- [x] 2.1 Create `lib/Settings/PersonalSettings.php` implementing `OCP\Settings\ISettings`, pointing to the Vue section template
- [x] 2.2 Register `PersonalSettings` via `$context->registerPersonalSettings()` in `Application::register()`

## 3. Frontend: Settings API Service

- [x] 3.1 Add `getSettings()` and `saveSettings(dir)` functions to the API layer (using `@nextcloud/axios` and the OCS endpoints)

## 4. Frontend: Personal Settings Component

- [x] 4.1 Create `src/components/PersonalSettings.vue` with a text input for the directory name and a Save button
- [x] 4.2 Load the current value from `getSettings()` on mount and display it in the input
- [x] 4.3 On save, validate client-side (non-empty, no `/` or `..`), call `saveSettings()`, and show success/error feedback
- [x] 4.4 Register the component as the Nextcloud personal settings section entry point (template rendered by `PersonalSettings.php`)

## 5. Frontend: Sidebar Settings Button

- [x] 5.1 Add a settings icon button at the bottom of `OrgSidebar.vue` using a `NcButton` with an icon from `@nextcloud/vue`
- [x] 5.2 Wire the button to navigate to the orgnotes personal settings section (use `generateUrl` from `@nextcloud/router`)

## 6. Lint, Build & Verify

- [x] 6.1 Run `pnpm run lint:fix` and resolve any warnings or errors
- [x] 6.2 Run `nix build` and confirm it succeeds
