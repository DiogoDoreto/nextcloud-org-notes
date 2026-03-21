# orgnotes

Nextcloud app that renders `.org` files in the Nextcloud Viewer as formatted HTML.

## Structure

- `app/` — the Nextcloud app (PHP + Vue 3 frontend)
- `openspec/` — change proposals and implementation tasks
- `specs/` — main specs

## Building

```bash
# JS frontend
cd app && pnpm run build   # outputs to app/js/

# Nix package
nix build                  # outputs appinfo/ lib/ templates/ js/
```

## Key decisions

- **Vue 3** with `@vitejs/plugin-vue` — `@nextcloud/vite-config` was dropped because it bundles `@vitejs/plugin-vue2` and cannot compile Vue 3 SFCs
- **OCS API** (`/ocs/v2.php/apps/orgnotes/api/v1/file?path=...`) — preferred over plain REST for Nextcloud convention and automatic CSRF handling
- **uniorg** over orga for Org parsing — closer to `org-element.el` spec fidelity
- **CSS custom properties** for highlight.js theming — maps `.hljs-*` classes to Nextcloud vars so light/dark theme switching works automatically

## Nix notes

- `src` filters out `node_modules/` via `cleanSourceWith` — new source files must be `git add`ed or Nix won't include them
- Update `pnpmDeps.hash` whenever `pnpm-lock.yaml` changes (run with a bogus hash to get the correct one from the error output)

## Peer dependency warnings (expected)

- `@nextcloud/viewer@1.0.0` requires Vue 2 — only one version is published; handler registration still works at runtime
