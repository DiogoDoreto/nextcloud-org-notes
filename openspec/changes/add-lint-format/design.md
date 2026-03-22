## Context

The frontend (`app/`) currently has no linting or formatting tooling. Source files use tabs for indentation (matching Nextcloud conventions) but there is no automated enforcement. The project uses `"type": "module"` in `package.json`, enabling native ESM in config files.

`@nextcloud/eslint-config` uses `@stylistic/eslint-plugin` internally to enforce formatting as lint rules. `@nextcloud/prettier-config` defines Prettier's formatting options. The two are aligned on all core style choices (tabs, no semicolons, single quotes, trailing commas).

## Goals / Non-Goals

**Goals:**
- Single command (`pnpm lint`) checks both lint rules and formatting
- `pnpm lint:fix` auto-fixes all fixable issues including formatting
- Configs live in `app/` co-located with `package.json`
- Use official Nextcloud tooling from `nextcloud-libraries`

**Non-Goals:**
- TypeScript support (project is JS-only)
- CI integration (out of scope for this change)
- Linting PHP files

## Decisions

### Use `recommendedJavascript` preset

The codebase uses Vue 3 with plain JavaScript (no TypeScript). The `recommended` preset requires TypeScript; `recommendedJavascript` is the correct preset.

### Integrate Prettier via `eslint-plugin-prettier`

`eslint-plugin-prettier` runs Prettier as an ESLint rule. Combined with `eslint-config-prettier` (bundled in `eslint-plugin-prettier/recommended`), this disables the `@stylistic` rules from `@nextcloud/eslint-config` that would conflict with Prettier, then enforces Prettier's output as a lint error.

Result: `eslint --fix` applies both lint fixes and Prettier formatting in one pass.

**Alternative considered**: Run Prettier separately (`prettier --write`). Rejected — the user wants a single `eslint` invocation to handle everything.

**Alternative considered**: Use `@stylistic` rules alone (skip Prettier). Rejected — `@nextcloud/prettier-config` is explicitly desired; integrating it via ESLint keeps the toolchain unified.

### Config placement in `app/`

All frontend tooling (`package.json`, `vite.config.js`) lives in `app/`. Placing `eslint.config.js` there is consistent and keeps lint scoped to the frontend source.

### `"prettier"` field in `package.json`

Prettier discovers its config via the `"prettier"` key in `package.json`. Pointing it to `@nextcloud/prettier-config` means both `eslint-plugin-prettier` (when running via ESLint) and any direct `prettier` invocation (e.g., editor plugins) use the same config.

## Risks / Trade-offs

- **Existing code may not pass on first run** → Run `pnpm lint:fix` after setup to auto-fix formatting; manually review any remaining errors
- **`@stylistic` rules disabled by `eslint-config-prettier`** → Some stylistic enforcement moves entirely to Prettier; the two configs agree on style so no regression in what's enforced
- **`pnpm-lock.yaml` changes** → Nix `pnpmDeps.hash` must be updated after install
