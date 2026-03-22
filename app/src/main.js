import OrgViewHandler from './views/OrgViewHandler.js'

const handler = {
	id: 'org-mode',
	mimes: ['text/org'],
	component: OrgViewHandler,
}

// Insert directly into _state.handlers before the Text app handler,
// which explicitly claims text/org. All other handlers register synchronously
// during script execution (before DOMContentLoaded). Our init script adds this
// listener first, so it fires before Viewer.vue's DOMContentLoaded callback
// processes the handlers array. By splicing in before 'text', we win the
// first-registered race for text/org.
document.addEventListener('DOMContentLoaded', () => {
	const viewer = window.OCA?.Viewer
	if (!viewer?._state?.handlers) return
	if (viewer._state.handlers.find(h => h.id === handler.id)) return

	const handlers = viewer._state.handlers
	const textIdx = handlers.findIndex(h => h.id === 'text')
	if (textIdx >= 0) {
		handlers.splice(textIdx, 0, handler)
		// Remove text/org from the text handler's mimes so it doesn't also
		// attempt to register it after us, which would log a "mime already
		// registered" error.
		const textHandler = handlers[textIdx + 1]
		if (textHandler?.mimes) {
			textHandler.mimes = textHandler.mimes.filter(m => m !== 'text/org')
		}
	} else {
		handlers.push(handler)
	}
}, { once: true })
