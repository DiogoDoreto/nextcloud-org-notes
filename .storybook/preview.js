import { setup } from '@storybook/vue3-vite'
import { initialize, mswLoader } from 'msw-storybook-addon'
import { createMemoryHistory, createRouter } from 'vue-router'

import './nextcloud-theme.css'

/**
 * Minimal mock of Nextcloud's global OC object so that @nextcloud/* packages
 * (l10n, router, auth, capabilities) degrade gracefully when rendered outside
 * a real Nextcloud instance.
 */
window.OC = {
	generateUrl: (url) => url,
	linkTo: (app, file) => `/apps/${app}/${file}`,
	filePath: (app, type, file) => `/apps/${app}/${type}/${file}`,
	getCapabilities: () => ({}),
	isUserLoggedIn: () => true,
	getCurrentUser: () => ({
		uid: 'admin',
		displayName: 'Admin User',
		isAdmin: true,
	}),
	config: {
		modRewriteWorking: false,
		session_lifetime: 900,
		session_keepalive: true,
		enable_avatars: true,
	},
	L10n: {
		translate: (_app, text) => text,
		translatePlural: (_app, singular, plural, n) =>
			n === 1 ? singular : plural,
		getLanguageCode: () => 'en',
		getLocale: () => 'en_US',
	},
	webroot: '',
	appswebroots: { core: '/core' },
	coreApps: ['core'],
	theme: {
		name: 'Nextcloud',
		productName: 'Nextcloud',
		title: 'Nextcloud',
		color: '#0082c9',
		colorText: '#ffffff',
		background: 'default',
	},
}
window.OCA = {}
window.OCP = {
	Accessibility: {
		disableKeyboardShortcuts: () => false,
	},
}
window._oc_config = window.OC.config

initialize()

setup((app) => {
	const router = createRouter({
		history: createMemoryHistory(),
		routes: [{ path: '/', component: { template: '<div />' } }],
	})
	app.use(router)
})

/** @type { import('@storybook/vue3-vite').Preview } */
export default {
	loaders: [mswLoader],
	parameters: {
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/,
			},
		},
	},
}
