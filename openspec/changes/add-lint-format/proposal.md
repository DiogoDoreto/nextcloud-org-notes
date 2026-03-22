## Why

The frontend has no linting or formatting tooling, leading to inconsistent code style and no automated enforcement of Nextcloud coding standards. Adding ESLint and Prettier (integrated via ESLint) establishes a consistent baseline and catches issues early.

## What Changes

- Add `@nextcloud/eslint-config` with the `recommendedJavascript` preset (Vue 3, no TypeScript)
- Add `@nextcloud/prettier-config` as the Prettier config, run through ESLint via `eslint-plugin-prettier`
- Add `eslint.config.js` in `app/`
- Add `lint` and `lint:fix` scripts to `app/package.json`
- Configure `"prettier"` field in `app/package.json` pointing to `@nextcloud/prettier-config`

## Capabilities

### New Capabilities

- `lint-format`: ESLint + Prettier tooling for the frontend — enforces Nextcloud coding standards and consistent formatting via a single `pnpm lint` command

### Modified Capabilities

<!-- none -->

## Impact

- `app/package.json`: new devDependencies (`eslint`, `@nextcloud/eslint-config`, `prettier`, `@nextcloud/prettier-config`, `eslint-plugin-prettier`), new `prettier` field, new `lint`/`lint:fix` scripts
- `app/eslint.config.js`: new file
- Existing source files in `app/src/` may need formatting fixes to pass lint on first run
- `pnpm-lock.yaml` will change (requires Nix hash update)
