import { registerHandler } from '@nextcloud/viewer'
import OrgView from './views/OrgView.vue'

registerHandler({
	id: 'org-mode',
	mimes: ['text/org'],
	component: OrgView,
})
