import { createApp } from 'vue'
import PersonalSettings from './components/PersonalSettings.vue'

/**
 *
 */
function mount() {
	const el = document.getElementById('orgnotes-personal-settings')
	if (el) {
		createApp(PersonalSettings).mount(el)
	}
}

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', mount)
} else {
	mount()
}
