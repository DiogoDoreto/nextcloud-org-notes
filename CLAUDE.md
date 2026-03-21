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

Note: after any code changes, ensure that nix build is successful

## Writing Vue 3 components

Always reuse exported components and utilities from `@nextcloud/vue`. You can find a copy of its source code for checking what's available at ./deps/nextcloud-vue/

## Nix notes

- `src` filters out `node_modules/` via `cleanSourceWith` — new source files must be `git add`ed or Nix won't include them
- Update `pnpmDeps.hash` whenever `pnpm-lock.yaml` changes (run with a bogus hash to get the correct one from the error output)

## Peer dependency warnings (expected)

- `@nextcloud/viewer@1.0.0` requires Vue 2 — only one version is published; handler registration still works at runtime
