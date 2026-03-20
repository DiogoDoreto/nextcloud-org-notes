## Context

Brand new Nextcloud app repository. The dev environment is Nix-based (`flake.nix`) and the production target is a NixOS Nextcloud module. The scaffold must produce a working Nextcloud PHP app that can be dropped into a Nextcloud instance's `apps-extra/` directory and enabled with `occ app:enable`. The frontend toolchain must be able to produce a compiled bundle. No existing code to migrate or preserve.

Nextcloud version target: latest (NC31+). PHP 8.4. Vue 3 via `@nextcloud/vite-config`.

## Goals / Non-Goals

**Goals:**
- Minimal Nextcloud PHP app structure that enables cleanly and renders a page
- Vite + Vue 3 build pipeline producing a bundle from a minimal entry point
- Nix dev shell with all required packages (`php84`, `composer`, `nodejs_22`, `pnpm`)
- App ID: `orgnotes` (lowercase, no underscores per App Store rules)

**Non-Goals:**
- `.org` file handling, MIME registration, or viewer integration
- Any business logic (file access, parsing, editing)
- NixOS module integration for running the Nextcloud instance
- Publishing or signing for the App Store

## Decisions

### App directory layout: `app/` at repo root

The Nextcloud app lives in `app/` inside this repository. When deploying to a Nextcloud instance, `app/` is symlinked or copied to `apps-extra/orgnotes/`. This keeps the Nix/OpenSpec tooling at the repo root separate from the Nextcloud app itself.

Alternative: put Nextcloud app files at repo root. Rejected — conflates repo tooling with app structure.

### Frontend toolchain: Vite via `@nextcloud/vite-config` (not webpack)

`@nextcloud/vite-config` is the forward-looking choice for NC29+ apps, uses Vue 3, and produces faster builds than `@nextcloud/webpack-vue-config`. Since we're targeting NC31+, there is no need for Vue 2 or webpack compatibility.

Alternative: `@nextcloud/webpack-vue-config`. Rejected — legacy path, Vue 2 only.

### Package manager: pnpm

pnpm is faster, uses a content-addressable store, and produces a `pnpm-lock.yaml` with better reproducibility. Available as `pkgs.pnpm` in nixpkgs-unstable.

### PHP version: `php84`

PHP 8.4 is the latest supported by NC31 and the latest available in nixpkgs-unstable. No reason to use an older version for a new project.

### App bootstrap: minimal `Application.php`

For the scaffold, `Application.php` extends `\OCP\AppFramework\App` with no custom DI registration — the framework handles `PageController` injection automatically. No `IBootstrap` needed until we register handlers or hooks.

### Single route: `GET /index`

One route to one controller method rendering one template. This is the minimum to prove routing works. No API routes, no file endpoints yet.

## Risks / Trade-offs

- **NC version compatibility**: `@nextcloud/vite-config` may have breaking changes between NC releases. → Pin to a specific minor version in `package.json`; check NC changelog when updating.
- **App ID conflicts**: `orgnotes` must not already be registered on the App Store if/when publishing. → Verify before publishing; out of scope for scaffold.
- **pnpm version in nixpkgs**: `pkgs.pnpm` version in nixpkgs-unstable may not match the `packageManager` field in `package.json`. → Omit `packageManager` field from `package.json` to avoid engine mismatch.

## Open Questions

- Should `app/` be gitignored or tracked? Tracked — it's the app source.
- Will the NixOS module integration require a specific app directory path? TBD — deferred to later phase.
