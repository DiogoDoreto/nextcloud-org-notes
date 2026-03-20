## Purpose

The Nextcloud PHP app skeleton — app identity, routing, controller, and template — sufficient to enable the app and render a page.

## Requirements

### Requirement: App registers with Nextcloud
The app SHALL provide a valid `appinfo/info.xml` that Nextcloud accepts when running `occ app:enable orgnotes`. The app ID SHALL be `orgnotes`.

#### Scenario: App enables without error
- **WHEN** `occ app:enable orgnotes` is run on a NC31+ instance with the app in `apps-extra/`
- **THEN** Nextcloud enables the app with no errors and the app appears as enabled in `occ app:list`

### Requirement: App renders a confirmation page
The app SHALL register a route `GET /apps/orgnotes` that renders an HTML page confirming the app is active. The page SHALL be accessible to authenticated Nextcloud users.

#### Scenario: Authenticated user visits app page
- **WHEN** an authenticated user navigates to `/apps/orgnotes`
- **THEN** the response is HTTP 200 and the page contains a confirmation that the app is active

#### Scenario: Unauthenticated access is rejected
- **WHEN** an unauthenticated request is made to `/apps/orgnotes`
- **THEN** Nextcloud redirects to the login page

### Requirement: App structure follows Nextcloud conventions
The app directory SHALL contain `appinfo/info.xml`, `appinfo/routes.php`, `lib/AppInfo/Application.php`, `lib/Controller/PageController.php`, and `templates/index.php`. The PHP namespace SHALL be `OCA\OrgNotes`.

#### Scenario: App directory is placed in apps-extra
- **WHEN** the `app/` directory is placed at `apps-extra/orgnotes/`
- **THEN** Nextcloud recognizes it as a valid app and can enable it
