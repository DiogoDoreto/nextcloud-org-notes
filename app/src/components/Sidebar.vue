<template>
	<div class="sidebar">
		<FilterInput :files="files" @update:filtered="filteredFiles = $event" />
		<SortControl v-model="sortOrder" />
		<FileList :files="sortedFiles" />
	</div>
</template>

<script>
import { defineComponent, ref, computed, onMounted } from 'vue'
import axios from '@nextcloud/axios'
import FilterInput from './FilterInput.vue'
import SortControl from './SortControl.vue'
import FileList from './FileList.vue'

export default defineComponent({
	name: 'OrgSidebar',

	components: { FilterInput, SortControl, FileList },

	setup() {
		const files = ref([])
		const filteredFiles = ref([])
		const sortOrder = ref('mtime-desc')

		onMounted(async () => {
			try {
				const url = '/ocs/v2.php/apps/orgnotes/api/v1/files?format=json'
				const response = await axios.get(url)
				files.value = response.data?.ocs?.data ?? []
				filteredFiles.value = files.value
			} catch {
				files.value = []
				filteredFiles.value = []
			}
		})

		const sortedFiles = computed(() => {
			const list = [...filteredFiles.value]
			if (sortOrder.value === 'name-asc') {
				list.sort((a, b) => a.name.localeCompare(b.name))
			} else if (sortOrder.value === 'name-desc') {
				list.sort((a, b) => b.name.localeCompare(a.name))
			} else if (sortOrder.value === 'mtime-asc') {
				list.sort((a, b) => a.mtime - b.mtime)
			} else {
				list.sort((a, b) => b.mtime - a.mtime)
			}
			return list
		})

		return { files, filteredFiles, sortOrder, sortedFiles }
	},
})
</script>

<style scoped>
.sidebar {
	padding: 8px;
}
</style>
