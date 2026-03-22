## ADDED Requirements

### Requirement: Org rendering pipeline is implemented in a shared module
The unified pipeline (`uniorg-parse` → `uniorg-rehype` → `rehype-highlight` → `rehype-stringify`) SHALL be implemented once in `src/lib/renderOrg.js` and exported as an async function. Both `OrgView.vue` and `OrgViewHandler.js` SHALL call this shared function instead of each defining their own pipeline. The function SHALL accept the org content string and an optional `idMap` object.

#### Scenario: OrgView.vue delegates to renderOrg
- **WHEN** OrgView.vue renders content
- **THEN** it calls the shared `renderOrg` function rather than constructing its own unified pipeline

#### Scenario: OrgViewHandler.js delegates to renderOrg
- **WHEN** OrgViewHandler.js processes a file
- **THEN** it calls the shared `renderOrg` function rather than constructing its own unified pipeline

### Requirement: Link handler validates URL schemes
The org link handler in `renderOrg.js` SHALL validate the URL scheme of non-`id` links before emitting an `<a>` element. Only links with an allowed scheme (`http:`, `https:`, `mailto:`, `file:`, `attachment:`) SHALL render as clickable anchors. Links with any other scheme (including `javascript:`) SHALL render as a `<span>` with the link label as text and no `href`.

#### Scenario: https link renders as anchor
- **WHEN** an org file contains `[[https://example.com][Example]]`
- **THEN** the rendered HTML contains `<a href="https://example.com">Example</a>`

#### Scenario: javascript: link is blocked
- **WHEN** an org file contains `[[javascript:alert(1)][click me]]`
- **THEN** the rendered HTML contains a `<span>` with the label text and no `<a>` element

#### Scenario: mailto link renders as anchor
- **WHEN** an org file contains `[[mailto:user@example.com][Email]]`
- **THEN** the rendered HTML contains `<a href="mailto:user@example.com">Email</a>`
