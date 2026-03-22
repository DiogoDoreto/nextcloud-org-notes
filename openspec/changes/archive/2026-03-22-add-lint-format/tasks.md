## 1. Install Dependencies

- [x] 1.1 Add `eslint`, `@nextcloud/eslint-config`, `prettier`, `@nextcloud/prettier-config`, and `eslint-plugin-prettier` as devDependencies in `app/package.json`
- [x] 1.2 Run `pnpm install` in `app/` to generate updated `pnpm-lock.yaml`
- [x] 1.3 Update `pnpmDeps.hash` in the Nix flake (run nix build with bogus hash to get the correct one)

## 2. Configure ESLint

- [x] 2.1 Create `app/eslint.config.js` using `recommendedJavascript` from `@nextcloud/eslint-config` and `eslint-plugin-prettier/recommended`
- [x] 2.2 Add `"prettier": "@nextcloud/prettier-config"` field to `app/package.json`

## 3. Add Scripts

- [x] 3.1 Add `"lint": "eslint src"` script to `app/package.json`
- [x] 3.2 Add `"lint:fix": "eslint --fix src"` script to `app/package.json`

## 4. Fix Existing Code

- [x] 4.1 Run `pnpm lint:fix` to auto-fix all formatting and fixable lint errors
- [x] 4.2 Run `pnpm lint` and manually fix any remaining errors
- [x] 4.3 Run `nix build` to verify the build still succeeds

## 5. Commit

- [x] 5.1 Commit all changes (config files, package.json, lock file, source fixes)
