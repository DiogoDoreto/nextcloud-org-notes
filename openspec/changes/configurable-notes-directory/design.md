## Context

The app hardcodes `/Notes/` as the root directory for org files in three places in `OrgController.php`. The directory check serves two purposes: (1) scoping which files the app manages, and (2) acting as a path traversal guard alongside the normalized-path check.

Nextcloud provides `IConfig` for storing per-user preferences, and `ISettingsManager` / `ISettings` for registering personal settings pages. No settings infrastructure currently exists in this app.

## Goals / Non-Goals

**Goals:**
- Allow each user to configure their own org files root directory
- Expose the setting via a personal settings page with a settings button in the sidebar
- Default to `Notes` for backwards compatibility
- Keep the path traversal guard intact

**Non-Goals:**
- Admin-level defaults or per-group configuration
- Multiple root directories
- Migrating existing files when the directory changes

## Decisions

### 1. Storage: `IConfig` user preference

Store the directory name as a Nextcloud user preference via `IConfig::setUserValue` / `IConfig::getUserValue`. Key: `notesDirectory`, app: `orgnotes`, default: `Notes`.

Alternatives considered:
- **Database table**: Unnecessary overhead for a single string per user.
- **`config.php` / system config**: Would be admin-scoped, not per-user.

### 2. Stored value: directory name only (not full path)

Store just the name (e.g. `org`) rather than an absolute or rooted path (e.g. `/org`). The backend always prefixes `/` when constructing the path guard (`'/' . $dir . '/'`), ensuring it is always relative to the user's own root folder. This keeps the stored value simple and avoids confusion over leading slashes.

Input is sanitized on save: strip leading/trailing slashes and whitespace, reject empty values and values containing `..` or `/` (sub-directory nesting is not supported in this iteration).

### 3. Settings API: new OCS endpoint

Add two OCS endpoints to `OrgController`:
- `GET  /api/v1/settings` — returns `{ "notesDirectory": "<value>" }`
- `PUT  /api/v1/settings` — accepts `{ "notesDirectory": "<value>" }`, validates, persists

This keeps all app API surface in one controller and follows the existing OCS pattern.

Alternatives considered:
- **Separate `SettingsController`**: Unnecessary for a single setting; can be split later if the settings page grows.

### 4. Frontend: `PersonalSettings.vue` registered via `OCP\Settings\ISettings`

Implement a PHP class `PersonalSettings` implementing `ISettings` that registers the Vue component into Nextcloud's personal settings section under the `Connected accounts` or a dedicated `Orgnotes` section.

The Vue component loads the current value on mount, shows a text input and save button, and calls the settings API.

### 5. Sidebar settings button

Add a gear/settings icon button at the bottom of `OrgSidebar.vue` that navigates to or opens the Nextcloud personal settings page (standard pattern: link to `/#/settings/user/orgnotes` or use `generateUrl`).

## Risks / Trade-offs

- **Invalid directory value stored**: A user could configure a directory that doesn't exist. The app will return an empty file list — acceptable, as this matches current behaviour if the `Notes` folder is absent.
- **Directory name containing path separators**: Mitigated by sanitization on save (reject values containing `/`).
- **Settings page registration complexity**: Nextcloud's `ISettings` registration is boilerplate-heavy for a first settings surface, but establishes the right pattern for future settings.

## Migration Plan

No data migration needed. Existing users continue to use `Notes` (the default when no preference is stored). No rollback steps required beyond redeploying the previous version.
