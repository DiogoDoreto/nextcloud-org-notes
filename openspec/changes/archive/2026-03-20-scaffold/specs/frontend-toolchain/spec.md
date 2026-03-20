## ADDED Requirements

### Requirement: Frontend build pipeline is configured
The app SHALL include a `package.json` and `vite.config.js` using `@nextcloud/vite-config` that produce a compiled JS bundle when `pnpm build` is run. The entry point SHALL be `src/main.js`.

#### Scenario: pnpm build succeeds
- **WHEN** `pnpm install && pnpm build` is run inside `app/`
- **THEN** the build completes without errors and produces output files in `app/js/`

#### Scenario: Build output is loadable by Nextcloud
- **WHEN** the app is enabled and the built assets are present
- **THEN** Nextcloud can load the JS bundle without console errors

### Requirement: Frontend uses Vue 3
The `package.json` SHALL declare `vue` at version 3.x and use `@nextcloud/vite-config` (not `@nextcloud/webpack-vue-config`). The minimum compatible Nextcloud version SHALL be 29.

#### Scenario: Vue 3 package is present
- **WHEN** `pnpm install` is run
- **THEN** `node_modules/vue` resolves to a Vue 3.x release
