<template>
	<div class="org-file">
		<header class="file-header">
			<h2 class="file-header__name">{{ title ?? path.split('/').pop() }}</h2>
			<template v-if="!editMode">
				<span v-if="formattedMtime" class="file-header__mtime"
					>Last updated {{ formattedMtime }}</span
				>
				<NcButton variant="tertiary" @click="enterEditMode">Edit</NcButton>
			</template>
			<template v-else>
				<span v-if="saveError" class="file-header__error">{{
					saveError
				}}</span>
				<NcButton variant="primary" :disabled="saving" @click="save"
					>Save</NcButton
				>
				<NcButton variant="tertiary" :disabled="saving" @click="cancel"
					>Cancel</NcButton
				>
			</template>
		</header>
		<div v-if="loading" class="file-loading">
			<span class="icon-loading" />
		</div>
		<OrgView
			v-else-if="!editMode"
			:content="rawContent"
			:fullWidth="true"
			:idMap="idMap" />
		<OrgEditor v-else v-model="editedContent" />
	</div>
</template>

<script>
import axios from '@nextcloud/axios'
import { computed, defineComponent, ref } from 'vue'
import { onBeforeRouteLeave, onBeforeRouteUpdate } from 'vue-router'
import NcButton from '@nextcloud/vue/components/NcButton'
import OrgView from '../views/OrgView.vue'
import OrgEditor from './OrgEditor.vue'

export default defineComponent({
	name: 'OrgFile',

	components: { NcButton, OrgView, OrgEditor },

	props: {
		path: {
			type: String,
			required: true,
		},

		idMap: {
			type: Object,
			default: () => ({}),
		},

		title: {
			type: String,
			default: null,
		},

		mtime: {
			type: Number,
			default: null,
		},
	},

	setup(props) {
		const rawContent = ref('')
		const editedContent = ref('')
		const editMode = ref(false)
		const loading = ref(true)
		const saving = ref(false)
		const saveError = ref(null)

		const isDirty = computed(() => editedContent.value !== rawContent.value)

		const formattedMtime = computed(() => {
			if (!props.mtime) return null
			return new Date(props.mtime * 1000).toLocaleDateString(undefined, {
				year: 'numeric',
				month: 'long',
				day: 'numeric',
			})
		})

		/**
		 * Fetches the raw org file content from the OCS API and initialises both
		 * rawContent and editedContent. Sets loading true for the duration.
		 */
		async function fetchContent() {
			loading.value = true
			try {
				const url = `/ocs/v2.php/apps/orgnotes/api/v1/file?path=${encodeURIComponent(props.path)}&format=json`
				const response = await axios.get(url)
				rawContent.value = response.data?.ocs?.data?.content ?? ''
				editedContent.value = rawContent.value
			} finally {
				loading.value = false
			}
		}

		fetchContent()

		/**
		 * Switches the component into edit mode, seeding the editor with the
		 * current rawContent so any unsaved prior edits are discarded.
		 */
		function enterEditMode() {
			editedContent.value = rawContent.value
			editMode.value = true
		}

		/**
		 * Persists editedContent to the server via the OCS API. On success,
		 * updates rawContent and exits edit mode. On failure, stores the error
		 * message in saveError for display.
		 */
		async function save() {
			saving.value = true
			saveError.value = null
			try {
				const url = `/ocs/v2.php/apps/orgnotes/api/v1/file?path=${encodeURIComponent(props.path)}&format=json`
				await axios.put(url, { content: editedContent.value })
				rawContent.value = editedContent.value
				editMode.value = false
			} catch (err) {
				saveError.value =
					err?.response?.data?.ocs?.meta?.message
					?? err?.message
					?? 'Failed to save'
			} finally {
				saving.value = false
			}
		}

		/**
		 * Exits edit mode, prompting the user for confirmation if there are
		 * unsaved changes. Resets editedContent to rawContent on discard.
		 */
		function cancel() {
			if (isDirty.value) {
				if (!window.confirm('Discard unsaved changes?')) return
			}
			editedContent.value = rawContent.value
			editMode.value = false
		}

		/**
		 * Vue Router navigation guard used for both route-leave and route-update
		 * events. Prompts the user to confirm discarding unsaved changes before
		 * allowing navigation to proceed.
		 *
		 * @return {boolean} true to allow navigation, false to cancel it
		 */
		function guardNavigation() {
			if (isDirty.value) {
				return window.confirm('You have unsaved changes. Discard them?')
			}
			return true
		}

		onBeforeRouteLeave(guardNavigation)
		onBeforeRouteUpdate(guardNavigation)

		return {
			rawContent,
			editedContent,
			editMode,
			loading,
			saving,
			saveError,
			isDirty,
			formattedMtime,
			enterEditMode,
			save,
			cancel,
		}
	},
})
</script>

<style scoped>
.file-header {
	position: sticky;
	top: 0;
	z-index: 10;
	background-color: var(--color-main-background);
	display: flex;
	align-items: center;
	flex-wrap: wrap;
	column-gap: 8px;
	padding: var(--app-navigation-padding, 4px) 20px
		var(--app-navigation-padding, 4px)
		calc(
			var(--default-clickable-area) + var(--app-navigation-padding, 4px) + 8px
		);
	border-bottom: 1px solid var(--color-border);
}

.file-header__name {
	font-size: 1.5em;
	font-weight: bold;
	margin: 0;
	flex: 1 1 auto;
}

.file-header__mtime {
	font-size: 0.85em;
	color: var(--color-text-maxcontrast);
	white-space: nowrap;
	flex: 0 0 auto;
}

.file-header__error {
	font-size: 0.85em;
	color: var(--color-error);
	flex: 0 0 auto;
}

.file-loading {
	display: flex;
	justify-content: center;
	padding: 40px;
}
</style>
