## 1. Dev Environment

- [x] 1.1 Add `php84`, `php84Packages.composer`, `nodejs_22`, and `pnpm` to `flake.nix` devShell buildInputs
- [x] 1.2 Run `nix develop` and verify all four tools are on PATH

## 2. PHP App Skeleton

- [x] 2.1 Create `app/appinfo/info.xml` with app ID `orgnotes`, name, description, and NC version compatibility (min 29, max 31)
- [x] 2.2 Create `app/appinfo/routes.php` with one route: `GET /` → `PageController@index`
- [x] 2.3 Create `app/lib/AppInfo/Application.php` extending `\OCP\AppFramework\App`
- [x] 2.4 Create `app/lib/Controller/PageController.php` with an `index()` method that returns a `TemplateResponse`
- [x] 2.5 Create `app/templates/index.php` with a simple confirmation message (e.g. "Org Notes is active")
- [x] 2.6 Create `app/composer.json` defining the `OCA\OrgNotes` PSR-4 autoload namespace

## 3. Frontend Toolchain

- [x] 3.1 Create `app/package.json` with `@nextcloud/vite-config` and `vue` (3.x) as dependencies
- [x] 3.2 Create `app/vite.config.js` using `createAppConfig` from `@nextcloud/vite-config`
- [x] 3.3 Create `app/src/main.js` as a minimal entry point (can be empty or a single comment)
- [x] 3.4 Run `pnpm install` inside `app/` and confirm no errors
- [x] 3.5 Run `pnpm build` inside `app/` and confirm output appears in `app/js/`
