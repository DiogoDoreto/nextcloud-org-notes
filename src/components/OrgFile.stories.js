import { http, HttpResponse } from 'msw'
import OrgFile from './OrgFile.vue'

const ORG_CONTENT = `#+TITLE: My Notes

* Introduction

This file is managed by *Nextcloud Org Notes*.

** Features

- /Rich formatting/: bold, italic, =verbatim=
- Code blocks with syntax highlighting
- Tables and definition lists
- TODO keywords and tags

** Example Table

| Feature     | Status |
|-------------|--------|
| Rendering   | Done   |
| Editing     | Done   |
| Search      | Planned |

** Code Example

#+BEGIN_SRC javascript
const notes = await fetchOrgFiles('/notes')
notes.forEach(file => render(file))
#+END_SRC
`

const SHORT_CONTENT = `* Untitled File

Some content here with *bold* and /italic/ text.
`

/**
 * Returns an MSW handler that responds to the OrgFile API endpoint.
 *
 * @param {string} content The org content to return in the mocked response
 */
function fileHandler(content) {
	return http.get('/ocs/v2.php/apps/orgnotes/api/v1/file', () =>
		HttpResponse.json({ ocs: { data: { content } } }),
	)
}

export default {
	title: 'Components/OrgFile',
	component: OrgFile,
	parameters: {
		layout: 'fullscreen',
		msw: { handlers: [fileHandler(ORG_CONTENT)] },
	},
}

export const Default = {
	args: {
		path: '/notes/my-notes.org',
		title: 'My Notes',
		mtime: Math.floor(Date.now() / 1000) - 3600,
	},
	parameters: {
		msw: { handlers: [fileHandler(ORG_CONTENT)] },
	},
}

export const NoTitle = {
	args: {
		path: '/notes/untitled.org',
		title: null,
		mtime: null,
	},
	parameters: {
		msw: { handlers: [fileHandler(SHORT_CONTENT)] },
	},
}

export const LoadError = {
	args: {
		path: '/notes/broken.org',
		title: 'Broken File',
		mtime: null,
	},
	parameters: {
		msw: {
			handlers: [
				http.get('/ocs/v2.php/apps/orgnotes/api/v1/file', () =>
					HttpResponse.json(
						{ ocs: { meta: { message: 'File not found' } } },
						{ status: 404 },
					),
				),
			],
		},
	},
}
