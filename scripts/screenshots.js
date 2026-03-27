#!/usr/bin/env node
import { execSync } from 'child_process'
import { existsSync } from 'fs'
import { mkdir, readFile } from 'fs/promises'
import { createServer } from 'http'
import { extname, join } from 'path'
/**
 * Captures a PNG screenshot for every Storybook story in both light and dark
 * theme variants and writes them under
 *   screenshots/light/{Title}/{Story name}.png
 *   screenshots/dark/{Title}/{Story name}.png
 *
 * The screenshots are committed to the repository so that git-diff / PR
 * review gives a visual baseline for every UI change.
 *
 * Usage:
 *   pnpm run screenshots              # build Storybook, then screenshot
 *   pnpm run screenshots --skip-build # reuse existing storybook-static/
 *
 * First-time setup (download Chromium once):
 *   pnpm exec playwright install chromium
 */
import { chromium } from 'playwright'
import { fileURLToPath } from 'url'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const STATIC_DIR = join(ROOT, 'storybook-static')
const SCREENSHOTS_DIR = join(ROOT, 'screenshots')
const VIEWPORT = { width: 1280, height: 720 }
const RENDER_TIMEOUT = 15_000
const THEMES = ['light', 'dark']

const MIME = {
	'.html': 'text/html',
	'.js': 'application/javascript',
	'.mjs': 'application/javascript',
	'.css': 'text/css',
	'.png': 'image/png',
	'.svg': 'image/svg+xml',
	'.json': 'application/json',
	'.ico': 'image/x-icon',
	'.woff': 'font/woff',
	'.woff2': 'font/woff2',
	'.txt': 'text/plain',
}

// ── 1. Optionally build Storybook ────────────────────────────────────────────

if (!process.argv.includes('--skip-build')) {
	console.log('Building Storybook…')
	execSync('pnpm run build-storybook', {
		cwd: ROOT,
		stdio: 'inherit',
		env: { ...process.env, STORYBOOK_DISABLE_TELEMETRY: '1' },
	})
}

const indexPath = join(STATIC_DIR, 'index.json')
if (!existsSync(indexPath)) {
	console.error(
		`No storybook-static/index.json found.\n`
			+ `Run without --skip-build, or run: pnpm run build-storybook`,
	)
	process.exit(1)
}

// ── 2. Read stories index ────────────────────────────────────────────────────

const storiesIndex = JSON.parse(await readFile(indexPath, 'utf8'))
const stories = Object.values(storiesIndex.entries).filter((s) => s.type === 'story')
console.log(`Found ${stories.length} stories × ${THEMES.length} themes.`)

// ── 3. Serve the static build over HTTP (required for service workers) ───────

const server = createServer(async (req, res) => {
	const urlPath = req.url.split('?')[0]
	const filePath = join(STATIC_DIR, urlPath === '/' ? '/index.html' : urlPath)
	try {
		const data = await readFile(filePath)
		const ext = extname(filePath).toLowerCase()
		res.writeHead(200, {
			'Content-Type': MIME[ext] ?? 'application/octet-stream',
		})
		res.end(data)
	} catch {
		res.writeHead(404)
		res.end('Not found')
	}
})

await new Promise((resolve) => server.listen(0, 'localhost', resolve))
const { port } = server.address()
console.log(`Serving Storybook at http://localhost:${port}`)

// ── 4. Launch browser and take screenshots ───────────────────────────────────

const browser = await chromium.launch()
const context = await browser.newContext({ viewport: VIEWPORT })

// Register service worker once so MSW is ready for all stories
const warmupPage = await context.newPage()
await warmupPage.goto(`http://localhost:${port}/`, {
	waitUntil: 'domcontentloaded',
})
// Give the service worker time to install and activate
await warmupPage.waitForTimeout(1500)
await warmupPage.close()

let passed = 0
let failed = 0

for (const theme of THEMES) {
	for (const story of stories) {
		const iframeUrl =
			`http://localhost:${port}/iframe.html`
			+ `?id=${story.id}&viewMode=story&globals=theme:${theme}`
		const page = await context.newPage()

		try {
			await page.goto(iframeUrl, { waitUntil: 'domcontentloaded' })

			// Wait for async rendering to settle (spinner gone or content present)
			await page
				.waitForFunction(
					() =>
						!document.querySelector(
							'#storybook-root .icon-loading, #storybook-root [data-loading]',
						),
					{ timeout: RENDER_TIMEOUT },
				)
				.catch(() => {}) // fall through – still screenshot whatever is visible

			await page
				.waitForLoadState('networkidle', { timeout: RENDER_TIMEOUT })
				.catch(() => {})

			// Safety buffer for CSS transitions / deferred paints
			await page.waitForTimeout(300)

			// screenshots/light/Components/OrgView/ or screenshots/dark/…
			const titleSegments = story.title.split('/')
			const storyDir = join(SCREENSHOTS_DIR, theme, ...titleSegments)
			await mkdir(storyDir, { recursive: true })

			const screenshotPath = join(storyDir, `${story.name}.png`)
			await page.screenshot({ path: screenshotPath, fullPage: false })

			console.log(`  ✓  [${theme}] ${story.title} / ${story.name}`)
			passed++
		} catch (err) {
			console.error(
				`  ✗  [${theme}] ${story.title} / ${story.name}: ${err.message}`,
			)
			failed++
		} finally {
			await page.close()
		}
	}
}

await browser.close()
server.close()

const total = passed + failed
console.log(
	`\nDone — ${passed}/${total} screenshots saved to screenshots/`
		+ (failed ? `  (${failed} failed)` : ''),
)
if (failed) process.exit(1)
