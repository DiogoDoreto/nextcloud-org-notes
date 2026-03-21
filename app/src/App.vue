<template>
	<NcContent app-name="orgnotes">
		<Sidebar :files="files" />
		<NcAppContent>
			<template v-if="selectedFileData">
				<header class="file-header">
					<h2 class="file-header__name">{{ selectedFileData.title ?? selectedFileData.name }}</h2>
					<span v-if="formattedMtime" class="file-header__mtime">Last updated {{ formattedMtime }}</span>
				</header>
				<OrgView :key="selectedFileData.path" :path="selectedFileData.path" :full-width="true" :id-map="idMap" />
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

		const idMap = computed(() => Object.fromEntries(files.value.filter(f => f.id).map(f => [f.id, f.path])))

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

		return { files, idMap, selectedFileData, formattedMtime }
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
	column-gap: 16px;
	padding: var(--app-navigation-padding, 4px) 20px var(--app-navigation-padding, 4px) calc(var(--default-clickable-area) + var(--app-navigation-padding, 4px) + 8px);
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
</style>
