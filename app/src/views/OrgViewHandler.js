import orgViewerStyles from './OrgViewHandler.css?inline'
import axios from '@nextcloud/axios'

// Inject styles once. Vite IIFE lib mode drops CSS files; inline import embeds
// the CSS as a string so we can inject it ourselves.
const styleEl = document.createElement('style')
styleEl.textContent = orgViewerStyles
document.head.appendChild(styleEl)
import { unified } from 'unified'
import uniorgParse from 'uniorg-parse'
import uniorgRehype from 'uniorg-rehype'
import rehypeHighlight from 'rehype-highlight'
import rehypeStringify from 'rehype-stringify'

// Vue 2.7-compatible viewer handler component (no template compilation).
// The Nextcloud Viewer uses Vue 2.7 and calls render(h) with h as first arg.
// An SFC compiled for Vue 3 would receive h as _ctx, crashing on property access.
// This plain JS component uses the Vue 2.7 render(h) signature directly.
//
// The Mime mixin is injected by Viewer.vue: handler.component.mixins = [..., Mime]
// It provides: filename (full path), basename, mime, active, doneLoading(), etc.
export default {
	name: 'OrgViewHandler',

	inheritAttrs: false,

	props: {
		fullWidth: {
			type: Boolean,
			default: false,
		},
	},

	data() {
		return {
			title: null,
			html: '',
			loading: true,
			error: null,
		}
	},

	async mounted() {
		try {
			const path = this.filename
			const url = `/ocs/v2.php/apps/orgnotes/api/v1/file?path=${encodeURIComponent(path)}&format=json`
			const response = await axios.get(url)
			const content = response.data?.ocs?.data?.content ?? ''
			const titleMatch = content.match(/^#\+TITLE:\s*(.+)$/mi)
			this.title = titleMatch ? titleMatch[1].trim() : null
			const result = await unified()
				.use(uniorgParse)
				.use(uniorgRehype, {
					handlers: {
						keyword() { return null },
					},
				})
				.use(rehypeHighlight)
				.use(rehypeStringify)
				.process(content)
			this.html = String(result)
		} catch (err) {
			this.error = err?.message ?? 'Failed to load file'
		} finally {
			this.loading = false
			this.doneLoading?.()
		}
	},

	render(h) {
		const classes = ['org-viewer']
		if (this.fullWidth) classes.push('org-viewer--full-width')

		if (this.loading) {
			return h('div', { class: classes }, [
				h('div', { class: ['org-viewer__loading'] }, [
					h('span', { class: ['icon-loading'] }),
				]),
			])
		}

		if (this.error) {
			return h('div', { class: classes }, [
				h('div', { class: ['org-viewer__inner'] }, [
					h('div', { class: ['org-viewer__error'] }, [this.error]),
				]),
			])
		}

		const inner = []
		if (this.title) {
			inner.push(h('h2', { class: ['org-viewer__title'] }, [this.title]))
		}
		inner.push(h('div', {
			class: ['org-viewer__content'],
			domProps: { innerHTML: this.html },
		}))

		return h('div', { class: classes }, [
			h('div', { class: ['org-viewer__inner'] }, inner),
		])
	},
}
