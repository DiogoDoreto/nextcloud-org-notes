<template>
	<div class="orgnotes-settings">
		<h2>Org Notes</h2>
		<p class="orgnotes-settings__description">
			Directory for org files (relative to your Nextcloud root)
		</p>
		<NcTextField
			v-model="directory"
			label="Notes directory"
			:error="!!errorMessage"
			:helperText="errorMessage || successMessage"
			:success="!!successMessage" />
		<NcButton :disabled="saving" variant="primary" @click="save">
			Save
		</NcButton>
	</div>
</template>

<script>
import { defineComponent, onMounted, ref } from 'vue'
import NcButton from '@nextcloud/vue/components/NcButton'
import NcTextField from '@nextcloud/vue/components/NcTextField'
import { getSettings, saveSettings } from '../lib/api.js'

export default defineComponent({
	name: 'PersonalSettings',

	components: { NcButton, NcTextField },

	setup() {
		const directory = ref('Notes')
		const saving = ref(false)
		const errorMessage = ref('')
		const successMessage = ref('')

		onMounted(async () => {
			try {
				const data = await getSettings()
				directory.value = data.notesDirectory ?? 'Notes'
			} catch {
				// leave default
			}
		})

		/**
		 *
		 */
		async function save() {
			errorMessage.value = ''
			successMessage.value = ''
			const value = directory.value.trim()
			if (!value) {
				errorMessage.value = 'Directory name must not be empty.'
				return
			}
			if (value.includes('/') || value.includes('..')) {
				errorMessage.value = 'Directory name must not contain "/" or "..".'
				return
			}
			saving.value = true
			try {
				await saveSettings(value)
				successMessage.value = 'Settings saved.'
			} catch {
				errorMessage.value = 'Failed to save settings.'
			} finally {
				saving.value = false
			}
		}

		return { directory, saving, errorMessage, successMessage, save }
	},
})
</script>

<style scoped>
.orgnotes-settings {
	display: flex;
	flex-direction: column;
	gap: 12px;
	max-width: 400px;
}

.orgnotes-settings__description {
	color: var(--color-text-maxcontrast);
}
</style>
