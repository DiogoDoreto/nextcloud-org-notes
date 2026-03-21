<template>
	<NcContent app-name="orgnotes">
		<Sidebar :files="files" />
		<NcAppContent>
			<template v-if="selectedFileData">
				<header class="file-header">
					<h2 class="file-header__name">{{ selectedFileData.name.replace(/\.org$/i, '') }}</h2>
					<span class="file-header__mtime">Last updated {{ formattedMtime }}</span>
				</header>
				<OrgView :path="selectedFileData.path" :full-width="true" />
			</template>
			<NcEmptyContent v-else name="Select a file" description="Select a file from the sidebar to view it." />
		</NcAppContent>
	</NcContent>
</template>

<script>
import { defineComponent, ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from '@nextcloud/axios'
import NcContent from '@nextcloud/vue/components/NcContent'
import NcAppContent from '@nextcloud/vue/components/NcAppContent'
import NcEmptyContent from '@nextcloud/vue/components/NcEmptyContent'
import Sidebar from './components/Sidebar.vue'
import OrgView from './views/OrgView.vue'

export default defineComponent({
	name: 'OrgBrowser',

	components: { NcContent, NcAppContent, NcEmptyContent, Sidebar, OrgView },

	setup() {
		const route = useRoute()
		const files = ref([])

		onMounted(async () => {
			try {
				const url = '/ocs/v2.php/apps/orgnotes/api/v1/files?format=json'
				const response = await axios.get(url)
				files.value = response.data?.ocs?.data ?? []
			} catch {
				files.value = []
			}
		})

		const selectedFileData = computed(() => {
			const path = route.query.file
			return path ? (files.value.find(f => f.path === path) ?? { path, name: path.split('/').pop() }) : null
		})

		const formattedMtime = computed(() => {
			if (!selectedFileData.value?.mtime) return null
			return new Date(selectedFileData.value.mtime * 1000).toLocaleDateString(undefined, {
				year: 'numeric', month: 'long', day: 'numeric',
			})
		})

		return { files, selectedFileData, formattedMtime }
	},
})
</script>

<style scoped>
.file-header {
	padding: 20px 20px 0;
	border-bottom: 1px solid var(--color-border);
	margin-bottom: 0;
}

.file-header__name {
	font-size: 1.5em;
	font-weight: bold;
	margin: 0 0 4px;
}

.file-header__mtime {
	font-size: 0.85em;
	color: var(--color-text-maxcontrast);
	display: block;
	margin-bottom: 12px;
}
</style>
