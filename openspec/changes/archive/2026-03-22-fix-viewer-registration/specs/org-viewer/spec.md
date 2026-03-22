## MODIFIED Requirements

### Requirement: Viewer handler is registered for text/org
The app's `main.js` SHALL call `registerHandler` from `@nextcloud/viewer` with `id: 'org-mode'` and `mimes: ['text/org']`, pointing to `OrgView.vue`. `Application.php::boot()` SHALL register a listener for `OCA\Files\Event\LoadAdditionalScriptsEvent` via the `IEventDispatcher` and call `\OCP\Util::addScript('orgnotes', 'main')` inside that listener. This ensures `main.js` is injected into the Nextcloud Files app page so the handler is registered before any file is clicked.

#### Scenario: Clicking a .org file opens the Org viewer
- **WHEN** a user clicks a `.org` file in the Nextcloud Files app
- **THEN** the Nextcloud Viewer modal opens and renders the file using `OrgView.vue`

#### Scenario: main.js is present in Files app page scripts
- **WHEN** the Nextcloud Files app page is loaded
- **THEN** `main.js` from the orgnotes app is included in the page's script resources
