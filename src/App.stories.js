import { http, HttpResponse } from 'msw'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import App from './App.vue'

const now = Math.floor(Date.now() / 1000)
const DAY = 86400

const SAMPLE_FILES = [
	{
		path: '/notes/todo.org',
		name: 'todo.org',
		title: 'My TODO List',
		mtime: now - 3600,
	},
	{
		path: '/notes/journal.org',
		name: 'journal.org',
		title: 'Daily Journal',
		mtime: now - DAY,
	},
	{
		path: '/notes/projects.org',
		name: 'projects.org',
		title: 'Projects',
		mtime: now - 2 * DAY,
	},
	{
		path: '/notes/reading.org',
		name: 'reading.org',
		title: 'Reading List',
		mtime: now - 10 * DAY,
	},
	{
		path: '/notes/archive/2024.org',
		name: '2024.org',
		title: 'Archive 2024',
		mtime: now - 400 * DAY,
	},
]

const FILE_CONTENT = `#+TITLE: My TODO List

* Work [1/3]

** DONE Fix rendering bug :work:
** TODO Write release notes :work:
** TODO Review pull requests :work:

* Personal

** TODO Buy groceries :errands:
** TODO Call dentist :health:

* Notes

Some *bold* and /italic/ text, plus a code block:

#+BEGIN_SRC javascript
const notes = await fetchOrgFiles('/notes')
notes.forEach((file) => render(file))
#+END_SRC
`

const filesHandler = http.get('/ocs/v2.php/apps/orgnotes/api/v1/files', () =>
	HttpResponse.json({ ocs: { data: SAMPLE_FILES } }),
)

const fileHandler = http.get('/ocs/v2.php/apps/orgnotes/api/v1/file', () =>
	HttpResponse.json({ ocs: { data: { content: FILE_CONTENT } } }),
)

// Stable component definitions (module-level) so Vue sees the same type on
// every render and updates in-place instead of unmounting + remounting.
const AppWrapper = {
	components: { App },
	template: '<App />',
}

const AppFileOpenWrapper = {
	components: { App },
	setup() {
		const router = useRouter()
		onMounted(() => router.replace({ query: { file: '/notes/todo.org' } }))
	},
	template: '<App />',
}

export default {
	title: 'App',
	component: App,
	parameters: {
		layout: 'fullscreen',
	},
}

/** No file selected — shows the sidebar and the empty-state prompt. */
export const EmptyState = {
	render: () => AppWrapper,
	parameters: {
		msw: { handlers: [filesHandler] },
	},
}

/**
 * A file is open — sidebar populated, file content rendered in the main area.
 * The router is pre-navigated to ?file=… so App.vue picks up the selection.
 */
export const FileOpen = {
	render: () => AppFileOpenWrapper,
	parameters: {
		msw: { handlers: [filesHandler, fileHandler] },
	},
}
