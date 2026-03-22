import { createApp } from 'vue'
import PersonalSettings from './components/PersonalSettings.vue'

const el = document.getElementById('orgnotes-personal-settings')
if (el) {
	createApp(PersonalSettings).mount(el)
}
