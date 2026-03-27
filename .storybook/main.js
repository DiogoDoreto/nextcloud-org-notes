/** @type { import('@storybook/vue3-vite').StorybookConfig } */
const config = {
	stories: ['../src/**/*.stories.@(js|mjs)'],
	framework: {
		name: '@storybook/vue3-vite',
		options: {},
	},
	staticDirs: ['../public'],
	async viteFinal(viteConfig) {
		viteConfig.define = {
			...viteConfig.define,
			// @nextcloud/vue reads these bare globals at module-init time.
			// They are normally injected by the app's Vite build config.
			appName: '"orgnotes"',
			appVersion: '"0.1.0"',
		}
		return viteConfig
	},
}

export default config
