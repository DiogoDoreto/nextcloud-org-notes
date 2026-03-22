## Context

`Application.php::boot()` currently only adds the app's CSS. The `main.js` file that calls `registerHandler()` is never injected into the Nextcloud Files app page, so the `@nextcloud/viewer` handler for `text/org` is never registered. When a user clicks a `.org` file, the viewer finds no matching handler and falls back to the built-in plain text preview.

## Goals / Non-Goals

**Goals:**
- Ensure `main.js` is loaded whenever the Files app page loads, so the viewer handler is available before any file is clicked.

**Non-Goals:**
- Changes to `main.js`, `OrgView.vue`, or any frontend code.
- Fixing MIME type detection or icon display.

## Decisions

**Use `LoadAdditionalScriptsEvent` from `OCA\Files\Event`**

The Files app dispatches this event when loading its page scripts. Listening for it in `boot()` and calling `Util::addScript()` is the standard Nextcloud pattern for injecting viewer handler scripts. The alternative — calling `Util::addScript()` unconditionally in `boot()` — would load `main.js` on every page in Nextcloud, not just Files, which wastes bandwidth and risks side effects on other pages.

## Risks / Trade-offs

- [Nextcloud version compatibility] `LoadAdditionalScriptsEvent` exists in Nextcloud 22+; the app already requires NC 31+ so this is safe.
- [Event not fired in viewer-only contexts] If a user opens a direct viewer URL without the Files app, the event won't fire. This matches expected behavior — the viewer is always opened from within Files.
