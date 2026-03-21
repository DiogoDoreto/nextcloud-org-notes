<template>
	<NcAppNavigation>
		<template #search>
			<NcAppNavigationSearch v-model="filterQuery" label="Filter files">
				<template #actions>
					<NcActions aria-label="Sort order">
						<NcActionRadio
							v-for="option in sortOptions"
							:key="option.value"
							v-model="sortOrder"
							:value="option.value"
							name="sort-order"
						>
							{{ option.label }}
						</NcActionRadio>
					</NcActions>
				</template>
			</NcAppNavigationSearch>
		</template>
		<template #list>
			<FileList :files="sortedFiles" />
		</template>
	</NcAppNavigation>
</template>

<script>
import { defineComponent, ref, computed, watch, onMounted } from 'vue'
import axios from '@nextcloud/axios'
import NcAppNavigation from '@nextcloud/vue/components/NcAppNavigation'
import NcAppNavigationSearch from '@nextcloud/vue/components/NcAppNavigationSearch'
import NcActions from '@nextcloud/vue/components/NcActions'
import NcActionRadio from '@nextcloud/vue/components/NcActionRadio'
import FileList from './FileList.vue'

export default defineComponent({
	name: 'OrgSidebar',

	components: { NcAppNavigation, NcAppNavigationSearch, NcActions, NcActionRadio, FileList },

	setup() {
		const files = ref([])
		const filterQuery = ref('')
		const sortOrder = ref('mtime-desc')

		const sortOptions = [
			{ value: 'mtime-desc', label: 'Modified newest' },
			{ value: 'mtime-asc', label: 'Modified oldest' },
			{ value: 'name-asc', label: 'Name A→Z' },
			{ value: 'name-desc', label: 'Name Z→A' },
		]

		onMounted(async () => {
			try {
				const url = '/ocs/v2.php/apps/orgnotes/api/v1/files?format=json'
				const response = await axios.get(url)
				files.value = response.data?.ocs?.data ?? []
			} catch {
				files.value = []
			}
		})

		let debounceTimer = null
		const filteredFiles = ref([])

		watch([files, filterQuery], ([newFiles, newQuery]) => {
			clearTimeout(debounceTimer)
			debounceTimer = setTimeout(() => {
				const q = newQuery.toLowerCase()
				filteredFiles.value = q
					? newFiles.filter(f => f.name.toLowerCase().includes(q))
					: newFiles
			}, 150)
		}, { immediate: true })

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

		return { filterQuery, sortOrder, sortOptions, sortedFiles }
	},
})
</script>
