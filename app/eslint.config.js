import { recommendedJavascript } from '@nextcloud/eslint-config'
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
]
