<template>
	<NcContent appName="orgnotes">
		<Sidebar :files="files" :loading="loading" />
		<NcAppContent>
			<OrgFile
				v-if="selectedFileData"
				:key="selectedFileData.path"
				:path="selectedFileData.path"
				:idMap="idMap"
				:title="selectedFileData.title ?? selectedFileData.name"
				:mtime="selectedFileData.mtime" />
			<div v-else class="app-empty-state">
				<NcEmptyContent
					name="Select a file"
					description="Select a file from the sidebar to view it.">
					<template #icon>
						<div class="app-icon-circle">
							<img :src="appIconUrl" alt="" />
						</div>
					</template>
				</NcEmptyContent>
			</div>
		</NcAppContent>
	</NcContent>
</template>

<script>
import axios from '@nextcloud/axios'
import { computed, defineComponent, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import NcAppContent from '@nextcloud/vue/components/NcAppContent'
import NcContent from '@nextcloud/vue/components/NcContent'
import NcEmptyContent from '@nextcloud/vue/components/NcEmptyContent'
import OrgFile from './components/OrgFile.vue'
import Sidebar from './components/OrgSidebar.vue'
import appIconUrl from '../img/app.svg?url'

export default defineComponent({
	name: 'OrgBrowser',

	components: { NcContent, NcAppContent, NcEmptyContent, Sidebar, OrgFile },

	setup() {
		const route = useRoute()
		const files = ref([])
		const loading = ref(true)

		onMounted(async () => {
			try {
				const url = '/ocs/v2.php/apps/orgnotes/api/v1/files?format=json'
				const response = await axios.get(url)
				files.value = response.data?.ocs?.data ?? []
			} catch {
				files.value = []
			} finally {
				loading.value = false
			}
		})

		const idMap = computed(() =>
			Object.fromEntries(
				files.value.filter((f) => f.id).map((f) => [f.id, f.path]),
			),
		)

		const selectedFileData = computed(() => {
			const path = route.query.file
			return path
				? (files.value.find((f) => f.path === path) ?? {
						path,
						name: path.split('/').pop(),
					})
				: null
		})

		return { appIconUrl, files, loading, idMap, selectedFileData }
	},
})
</script>

<style scoped>
.app-empty-state {
	height: 100%;
	display: flex;
}

.app-icon-circle {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 64px;
	height: 64px;
	border-radius: 50%;
	background-color: var(--color-primary);
}

.app-icon-circle img {
	width: 40px;
	height: 40px;
}
</style>
