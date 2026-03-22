# orgnotes

Nextcloud app that renders `.org` files in the Nextcloud Viewer as formatted HTML.

## Structure

- `openspec/` — change proposals and implementation tasks
- `specs/` — main specs

## Building

```bash
# JS frontend
pnpm run build   # outputs to js/

# Nix package
nix build                  # outputs appinfo/ lib/ templates/ js/
```

Note: after any code changes, ensure that:
- `pnpm run lint:fix` has no errors nor warnings
- nix build is successful
- then commit your changes

## Writing Vue 3 components

Always reuse exported components and utilities from `@nextcloud/vue`. You can find a copy of its source code for checking what's available at ./deps/nextcloud-vue/

## Nix notes

- `src` uses an allowlist filter via `cleanSourceWith` — new source directories must be added to the allowlist in `flake.nix` and `git add`ed or Nix won't include them
- Update `pnpmDeps.hash` whenever `pnpm-lock.yaml` changes (run with a bogus hash to get the correct one from the error output)

## Peer dependency warnings (expected)

- `@nextcloud/viewer@1.0.0` requires Vue 2 — only one version is published; handler registration still works at runtime
