import { createApp } from 'vue'
import PersonalSettings from './components/PersonalSettings.vue'

/**
 * Mounts the PersonalSettings Vue app into the #orgnotes-personal-settings element.
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
