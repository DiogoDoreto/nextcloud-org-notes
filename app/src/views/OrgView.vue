<template>
	<div class="org-viewer" :class="{ 'org-viewer--full-width': fullWidth }">
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
import { unified } from 'unified'
import uniorgParse from 'uniorg-parse'
import uniorgRehype from 'uniorg-rehype'
import rehypeHighlight from 'rehype-highlight'
import rehypeStringify from 'rehype-stringify'

export default {
	name: 'OrgView',

	props: {
		content: {
			type: String,
			required: true,
		},
		fullWidth: {
			type: Boolean,
			default: false,
		},
		idMap: {
			type: Object,
			default: () => ({}),
		},
	},

	data() {
		return {
			html: '',
			loading: true,
			error: null,
		}
	},

	watch: {
		content: { immediate: true, handler: 'renderContent' },
	},

	methods: {
		async renderContent() {
			this.loading = true
			this.error = null
			try {
				const idMap = this.idMap
				const result = await unified()
					.use(uniorgParse)
					.use(uniorgRehype, {
						handlers: {
							keyword: function() {
								return null
							},
							link: function(org) {
								if (org.linkType === 'id') {
									const path = idMap[org.path]
									const children = org.children.length
										? this.toHast(org.children, org)
										: [{ type: 'text', value: org.rawLink }]
									if (path) {
										return this.h(org, 'a', { href: `#/?file=${encodeURIComponent(path)}` }, children)
									}
									return this.h(org, 'span', {}, children)
								}
							},
						},
					})
					.use(rehypeHighlight)
					.use(rehypeStringify)
					.process(this.content)
				this.html = String(result)
			} catch (err) {
				this.error = err?.message ?? 'Failed to render file'
			} finally {
				this.loading = false
			}
		},
	},
}
</script>

<style scoped>
.org-viewer {
	padding: 20px;
	max-width: 860px;
	margin: 0 auto;
}

.org-viewer--full-width {
	max-width: none;
	margin: 0;
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

<!-- Content styles (non-scoped so v-html content is styled) -->
<style>
/* Typography baseline */
.org-viewer__content {
	line-height: 1.5;
	overflow-wrap: break-word;
	tab-size: 4;
}

/* Block margins */
.org-viewer__content p,
.org-viewer__content ul,
.org-viewer__content ol,
.org-viewer__content dl,
.org-viewer__content blockquote,
.org-viewer__content pre,
.org-viewer__content table,
.org-viewer__content hr {
	margin-block-end: 1em;
}

/* First/last child margin reset */
.org-viewer__content > :first-child,
.org-viewer__content blockquote > :first-child {
	margin-top: 0;
}

.org-viewer__content > :last-child,
.org-viewer__content blockquote > :last-child {
	margin-block-end: 0;
}

/* Document title (#+TITLE:) */
.org-viewer__content h1.org-title {
	font-size: 2.2em;
	font-weight: bold;
	margin-block-end: 1em;
	padding-block-end: 0.4em;
	border-block-end: 1px solid var(--color-border);
}

/* Headings */
.org-viewer__content h1,
.org-viewer__content h2,
.org-viewer__content h3,
.org-viewer__content h4,
.org-viewer__content h5,
.org-viewer__content h6 {
	font-weight: bold;
	margin-block-end: 0.5em;
}

.org-viewer__content h1 { font-size: 2em; }
.org-viewer__content h2 { font-size: 1.5em; }
.org-viewer__content h3 { font-size: 1.25em; }
.org-viewer__content h4 { font-size: 1.1em; }
.org-viewer__content h5 { font-size: 1em; }
.org-viewer__content h6 { font-size: 0.9em; }

/* Lists */
.org-viewer__content ul {
	list-style-type: disc;
	padding-inline-start: 4ch;
}

.org-viewer__content ol {
	list-style-type: decimal;
	padding-inline-start: 4ch;
}

/* Definition lists */
.org-viewer__content dl {
	display: grid;
	grid-template-columns: max-content 1fr;
	column-gap: 2ch;
	row-gap: 0.25em;
}

.org-viewer__content dl > dt {
	font-weight: bold;
}

.org-viewer__content dl > dd {
	margin: 0;
}

/* Blockquote */
.org-viewer__content blockquote {
	border-inline-start: 2px solid var(--color-border-dark);
	padding-inline-start: 1em;
	color: var(--color-text-maxcontrast);
}

/* Horizontal rule */
.org-viewer__content hr {
	border: none;
	border-top: 1px solid var(--color-border);
	margin-block: 1.5em;
}

/* Links */
.org-viewer__content a {
	text-decoration: underline;
	color: var(--color-primary-element);
}

/* Images */
.org-viewer__content img {
	max-width: 100%;
	height: auto;
}

/* Inline code and verbatim */
.org-viewer__content code.inline-code,
.org-viewer__content code.inline-verbatim {
	font-family: monospace;
	background: var(--color-background-dark);
	padding: 0.1em 0.3em;
	border-radius: var(--border-radius, 3px);
}

/* Code blocks */
.org-viewer__content pre.src-block {
	direction: ltr;
}

/* Verse blocks */
.org-viewer__content pre.verse {
	font-family: inherit;
	font-style: italic;
	white-space: pre-wrap;
	border-inline-start: 2px solid var(--color-border-dark);
	padding-inline-start: 1em;
}

/* Example blocks */
.org-viewer__content div.example {
	font-family: monospace;
	background: var(--color-background-dark);
	padding: 1em;
	border-radius: var(--border-radius, 3px);
}

/* Center blocks */
.org-viewer__content div.center {
	text-align: center;
}

/* Tables */
.org-viewer__content table {
	border-collapse: collapse;
	border: 1px solid var(--color-border-maxcontrast);
}

.org-viewer__content th,
.org-viewer__content td {
	padding: var(--default-grid-baseline, 4px);
	border: 1px solid var(--color-border-maxcontrast);
}

.org-viewer__content th {
	background: var(--color-background-dark);
	font-weight: bold;
}

/* Todo keywords */
.org-viewer__content span.todo-keyword {
	font-weight: bold;
	font-size: 0.85em;
	text-transform: uppercase;
	margin-inline-end: 0.4em;
	padding: 0.1em 0.4em;
	border-radius: var(--border-radius, 3px);
	background: var(--color-background-dark);
	color: var(--color-text-maxcontrast);
}

.org-viewer__content span.todo-keyword.TODO,
.org-viewer__content span.todo-keyword.FIXME {
	background: var(--color-warning);
	color: var(--color-warning-text);
}

.org-viewer__content span.todo-keyword.DONE {
	background: var(--color-success);
	color: var(--color-success-text);
}

/* Tags */
.org-viewer__content span.tag {
	background: var(--color-background-dark);
	border-radius: var(--border-radius, 3px);
	padding: 0.1em 0.4em;
	font-size: 0.85em;
	margin-inline-start: 0.25em;
}

/* Priority */
.org-viewer__content span.priority {
	font-weight: bold;
	color: var(--color-text-maxcontrast);
	margin-inline-end: 0.4em;
}

/* Footnote definitions */
.org-viewer__content div.footnote-definition {
	border-top: 1px solid var(--color-border);
	padding-top: 0.5em;
	font-size: 0.875em;
	color: var(--color-text-maxcontrast);
}

/* highlight.js theming */
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
