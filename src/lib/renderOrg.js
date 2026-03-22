import rehypeHighlight from 'rehype-highlight'
import rehypeStringify from 'rehype-stringify'
import { unified } from 'unified'
import uniorgParse from 'uniorg-parse'
import uniorgRehype from 'uniorg-rehype'

const ALLOWED_SCHEMES = ['http:', 'https:', 'mailto:', 'file:', 'attachment:']

/**
 * Renders org-mode content to an HTML string.
 *
 * @param {string} content Raw org-mode text to render
 * @param {object} options Optional configuration
 * @param {object} options.idMap Map of org IDs to file paths for resolving [[id:...]] links
 * @return {Promise<string>} Rendered HTML string
 */
export async function renderOrg(content, { idMap = {} } = {}) {
	const result = await unified()
		.use(uniorgParse)
		.use(uniorgRehype, {
			handlers: {
				keyword() {
					return null
				},
				link(org) {
					if (org.linkType === 'id') {
						const path = idMap[org.path]
						const children = org.children.length
							? this.toHast(org.children, org)
							: [{ type: 'text', value: org.rawLink }]
						if (path) {
							return this.h(
								org,
								'a',
								{ href: `#/?file=${encodeURIComponent(path)}` },
								children,
							)
						}
						return this.h(org, 'span', {}, children)
					}

					const allowed = ALLOWED_SCHEMES.some((s) =>
						org.rawLink.startsWith(s),
					)
					if (!allowed) {
						const children = org.children.length
							? this.toHast(org.children, org)
							: [{ type: 'text', value: org.rawLink }]
						return this.h(org, 'span', {}, children)
					}
				},
			},
		})
		.use(rehypeHighlight)
		.use(rehypeStringify)
		.process(content)
	return String(result)
}
