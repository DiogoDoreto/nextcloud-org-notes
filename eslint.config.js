import { recommendedJavascript } from '@nextcloud/eslint-config'
import globals from 'globals'
import prettierRecommended from 'eslint-plugin-prettier/recommended'

export default [
	...recommendedJavascript,
	prettierRecommended,
	{
		rules: {
			// Disable rules that conflict with Prettier formatting not covered by eslint-config-prettier
			'@stylistic/exp-list-style': 'off',
		},
	},
	{
		// Node.js scripts: allow process, console, and other Node globals
		files: ['scripts/**/*.js'],
		languageOptions: {
			globals: globals.node,
		},
		rules: {
			'no-console': 'off',
		},
	},
]
