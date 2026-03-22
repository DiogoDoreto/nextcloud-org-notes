## Context

The sidebar footer currently renders a small icon-only button for settings. The main content area uses `NcEmptyContent` without a wrapper, so it renders at the top of `NcAppContent` rather than being vertically centered. `NcAppContent` is not a flex container, so `NcEmptyContent`'s built-in `flex-grow: 1` has no effect.

The app icon (`img/app.svg`) has `fill: #ffffff` — designed for colored backgrounds — so it needs a colored container to be visible on neutral backgrounds.

## Goals / Non-Goals

**Goals:**
- Settings button is discoverable and clearly labelled
- Empty state is vertically centered regardless of viewport height
- App icon appears in the empty state with correct visual treatment

**Non-Goals:**
- Changing the settings page itself
- Modifying any other empty states (loading, no files, no filter results)

## Decisions

**Settings button: use `NcButton` with `wide` prop and text**

`NcButton` already has a `wide` boolean prop that sets `width: 100%`. Adding text "Org Notes settings" alongside the cog icon satisfies the label requirement without custom CSS. The footer `div` can be simplified to just padding.

Alternatives considered:
- Custom styled `<a>` tag: avoids Nextcloud component but loses accessibility and hover states
- `NcAppNavigationSettings`: intended for a different layout pattern (bottom-pinned nav item), not applicable here

**Empty state vertical centering: flex wrapper div**

Wrap `NcEmptyContent` in a `<div class="app-empty-state">` with `height: 100%; display: flex`. This activates `NcEmptyContent`'s `flex-grow: 1`, which combined with its own `justify-content: center` / `align-items: center` produces full vertical centering.

Alternatives considered:
- CSS on `NcEmptyContent` directly via `:deep()`: would work but is more fragile and couples App.vue to component internals
- `min-height: 100%` on wrapper: insufficient since the parent has `overflow: auto` not `display: flex`

**App icon: `?url` import + colored circle container**

Import `img/app.svg` as a URL (`?url` Vite suffix). Render via `<img>` inside a `<div class="app-icon-circle">` styled with `background-color: var(--color-primary)` and circular border-radius. This matches how Nextcloud renders app icons in the app grid and makes the white SVG visible on all themes.

Alternatives considered:
- `?raw` import + `v-html`: works but `v-html` is discouraged for static assets
- `NcIconSvgWrapper` with extracted path: the SVG path uses a coordinate transform that doesn't map cleanly to the 0 0 24 24 viewBox

## Risks / Trade-offs

- [App icon white fill] On high-contrast or unusual themes the `--color-primary` circle may not render ideally → Acceptable: matches Nextcloud's own app icon convention
- [Wrapper div height] If `NcAppContent` ever changes its height model, the wrapper may need adjustment → Low risk: `height: 100%` is a stable CSS primitive
