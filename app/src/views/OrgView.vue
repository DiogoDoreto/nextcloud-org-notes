<template>
	<div class="org-viewer">
		<div v-if="loading" class="org-viewer__loading">
			<span class="icon-loading" />
		</div>
		<div v-else-if="error" class="org-viewer__error">
			{{ error }}
		</div>
		<!-- eslint-disable-next-line vue/no-v-html -->
		<div v-else class="org-viewer__content" v-html="html" />
	</div>
</template>

<script>
import axios from '@nextcloud/axios'
import { unified } from 'unified'
import uniorgParse from 'uniorg-parse'
import uniorgRehype from 'uniorg-rehype'
import rehypeHighlight from 'rehype-highlight'
import rehypeStringify from 'rehype-stringify'

export default {
	name: 'OrgView',

	props: {
		path: {
			type: String,
			required: true,
		},
		mime: {
			type: String,
			default: 'text/org',
		},
	},

	data() {
		return {
			html: '',
			loading: true,
			error: null,
		}
	},

	async mounted() {
		try {
			const url = `/ocs/v2.php/apps/orgnotes/api/v1/file?path=${encodeURIComponent(this.path)}&format=json`
			const response = await axios.get(url)
			const content = response.data?.ocs?.data?.content ?? ''
			const result = await unified()
				.use(uniorgParse)
				.use(uniorgRehype)
				.use(rehypeHighlight)
				.use(rehypeStringify)
				.process(content)
			this.html = String(result)
		} catch (err) {
			this.error = err?.message ?? 'Failed to load file'
		} finally {
			this.loading = false
		}
	},
}
</script>

<style scoped>
.org-viewer {
	padding: 20px;
	max-width: 860px;
	margin: 0 auto;
}

.org-viewer__loading {
	display: flex;
	justify-content: center;
	padding: 40px;
}

.org-viewer__error {
	color: var(--color-error);
	padding: 20px;
}
</style>

<!-- highlight.js theming via Nextcloud CSS custom properties (non-scoped so v-html content is styled) -->
<style>
.org-viewer__content .hljs {
	background: var(--color-background-dark, #ededed);
	color: var(--color-main-text, #222);
	display: block;
	overflow-x: auto;
	padding: 1em;
	border-radius: var(--border-radius, 3px);
}

.org-viewer__content .hljs-keyword,
.org-viewer__content .hljs-selector-tag,
.org-viewer__content .hljs-tag {
	color: var(--color-primary-element, #0082c9);
}

.org-viewer__content .hljs-string,
.org-viewer__content .hljs-attribute,
.org-viewer__content .hljs-addition {
	color: var(--color-success, #46ba61);
}

.org-viewer__content .hljs-comment,
.org-viewer__content .hljs-quote {
	color: var(--color-text-maxcontrast, #6d6d6d);
	font-style: italic;
}

.org-viewer__content .hljs-number,
.org-viewer__content .hljs-literal {
	color: var(--color-warning, #eca700);
}

.org-viewer__content .hljs-title,
.org-viewer__content .hljs-section,
.org-viewer__content .hljs-name {
	color: var(--color-primary, #0082c9);
	font-weight: bold;
}

.org-viewer__content .hljs-built_in,
.org-viewer__content .hljs-symbol,
.org-viewer__content .hljs-type {
	color: var(--color-text-maxcontrast, #6d6d6d);
}
</style>
