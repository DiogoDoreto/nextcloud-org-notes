## Why

This is a brand new repository for a Nextcloud Org Mode app. Before building any real functionality, we need a working scaffold that proves the Nextcloud integration — PHP routing, DI bootstrap, and frontend toolchain — are correctly set up. Without this foundation validated, all subsequent work builds on unverified assumptions.

## What Changes

- Add the minimal Nextcloud app structure (`appinfo/`, `lib/`, `templates/`) to register and enable the app in Nextcloud
- Add a single PHP page route that renders a confirmation template, proving PHP routing and DI work
- Add the frontend toolchain scaffold (`package.json`, `vite.config.js`, `src/main.js`) using `@nextcloud/vite-config` and Vue 3, proving the build pipeline works
- Add `composer.json` for PHP autoloading
- Update `flake.nix` with the required dev dependencies: `php84`, `php84Packages.composer`, `nodejs_22`, `pnpm`

## Capabilities

### New Capabilities

- `app-scaffold`: The Nextcloud PHP app skeleton — app identity, routing, controller, and template — sufficient to enable the app and render a page
- `frontend-toolchain`: The Vite + Vue 3 build pipeline configured with `@nextcloud/vite-config`, producing a bundle from an empty entry point
- `dev-environment`: The Nix dev shell with all required packages for PHP and Node.js development

### Modified Capabilities

## Impact

- `flake.nix`: New packages added to `devShell.buildInputs`
- New top-level `app/` directory containing the Nextcloud app
- No existing functionality affected — brand new repo
