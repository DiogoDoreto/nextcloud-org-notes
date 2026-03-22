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
			<NcEmptyContent
				v-else
				name="Select a file"
				description="Select a file from the sidebar to view it." />
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

		return { files, loading, idMap, selectedFileData }
	},
})
</script>
