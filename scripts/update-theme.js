#!/usr/bin/env node
/**
 * Fetches the latest Nextcloud default CSS from upstream and updates the
 * :root block in .storybook/nextcloud-theme.css, preserving the Storybook-
 * specific baseline rules that follow the "Storybook baseline" marker.
 *
 * Usage: pnpm run update-theme
 */
import { readFile, writeFile } from 'fs/promises'
import { join } from 'path'
import { fileURLToPath } from 'url'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const THEME_PATH = join(ROOT, '.storybook/nextcloud-theme.css')
const UPSTREAM_URL =
	'https://raw.githubusercontent.com/nextcloud/server/master/apps/theming/css/default.css'
const BASELINE_MARKER = '/* Storybook baseline'

console.log(`Fetching ${UPSTREAM_URL} …`)
const res = await fetch(UPSTREAM_URL)
if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`)
const upstream = await res.text()

// Drop the two SPDX comment lines at the top; keep the :root { … } block as-is
const rootBlock = upstream
	.split('\n')
	.filter((line) => !line.startsWith('/** SPDX-'))
	.join('\n')
	.trim()

const current = await readFile(THEME_PATH, 'utf8')
const baselineIdx = current.indexOf(BASELINE_MARKER)
if (baselineIdx === -1)
	throw new Error(`Marker "${BASELINE_MARKER}" not found in ${THEME_PATH}`)
const baseline = current.slice(baselineIdx)

const header = `\
/**
 * Nextcloud default CSS custom properties, sourced verbatim from:
 * https://github.com/nextcloud/server/blob/master/apps/theming/css/default.css
 *
 * Update with: pnpm run update-theme
 *
 * SPDX-FileCopyrightText: 2022 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
`

await writeFile(THEME_PATH, `${header}${rootBlock}\n\n${baseline}`)
console.log(`Updated ${THEME_PATH}`)
