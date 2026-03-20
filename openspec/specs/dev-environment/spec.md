## Purpose

The Nix dev shell with all required packages for PHP and Node.js development.

## Requirements

### Requirement: Nix dev shell provides all required tools
The `flake.nix` devShell SHALL include `php84`, `php84Packages.composer`, `nodejs_22`, and `pnpm`. All tools SHALL be available on `PATH` after entering the shell with `nix develop`.

#### Scenario: PHP is available in dev shell
- **WHEN** `nix develop --command php --version` is run
- **THEN** the output shows PHP 8.4.x

#### Scenario: Composer is available in dev shell
- **WHEN** `nix develop --command composer --version` is run
- **THEN** the command exits successfully

#### Scenario: Node.js is available in dev shell
- **WHEN** `nix develop --command node --version` is run
- **THEN** the output shows Node.js 22.x

#### Scenario: pnpm is available in dev shell
- **WHEN** `nix develop --command pnpm --version` is run
- **THEN** the command exits successfully
