import OrgSidebar from './OrgSidebar.vue'

const now = Math.floor(Date.now() / 1000)
const HOUR = 3600
const DAY = 86400

const SAMPLE_FILES = [
	{
		path: '/notes/todo.org',
		name: 'todo.org',
		title: 'My TODO List',
		mtime: now - HOUR,
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
		path: '/notes/recipes.org',
		name: 'recipes.org',
		title: 'Recipes',
		mtime: now - 20 * DAY,
	},
	{
		path: '/notes/archive/2024.org',
		name: '2024.org',
		title: 'Archive 2024',
		mtime: now - 400 * DAY,
	},
]

export default {
	title: 'Components/OrgSidebar',
	component: OrgSidebar,
	parameters: {
		layout: 'fullscreen',
	},
	argTypes: {
		loading: { control: 'boolean' },
	},
}

export const WithFiles = {
	args: {
		files: SAMPLE_FILES,
		loading: false,
	},
	parameters: {
		layout: 'fullscreen',
	},
}

export const Loading = {
	args: {
		files: [],
		loading: true,
	},
}

export const Empty = {
	args: {
		files: [],
		loading: false,
	},
}

export const SingleFile = {
	args: {
		files: [SAMPLE_FILES[0]],
		loading: false,
	},
}
