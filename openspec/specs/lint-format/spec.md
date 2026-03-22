## Purpose

Defines requirements for frontend linting and formatting tooling using ESLint and Prettier integrated via `eslint-plugin-prettier`.

## Requirements

### Requirement: ESLint enforces Nextcloud coding standards
The frontend SHALL use `@nextcloud/eslint-config`'s `recommendedJavascript` preset to enforce Nextcloud coding standards across all `.js` and `.vue` files in `app/src/`.

#### Scenario: Lint passes on valid code
- **WHEN** developer runs `pnpm lint` in `app/`
- **THEN** ESLint exits with code 0 and reports no errors

#### Scenario: Lint fails on rule violation
- **WHEN** a source file contains a Nextcloud ESLint rule violation
- **THEN** `pnpm lint` exits with a non-zero code and reports the violation with file and line number

### Requirement: Prettier formatting enforced via ESLint
Prettier formatting SHALL be enforced as an ESLint rule via `eslint-plugin-prettier`, using `@nextcloud/prettier-config` as the Prettier configuration. Running `pnpm lint` SHALL report formatting violations as ESLint errors.

#### Scenario: Formatting violation reported as lint error
- **WHEN** a source file is not formatted according to `@nextcloud/prettier-config`
- **THEN** `pnpm lint` reports it as an ESLint error (rule: `prettier/prettier`)

#### Scenario: Fix auto-formats code
- **WHEN** developer runs `pnpm lint:fix`
- **THEN** all auto-fixable lint errors are resolved, including Prettier formatting

### Requirement: Single lint command covers all checks
Running `pnpm lint` SHALL check both ESLint rules and Prettier formatting in one invocation, with no separate formatting command required.

#### Scenario: One command for all checks
- **WHEN** developer runs `pnpm lint`
- **THEN** both lint rule violations and formatting violations are reported together
