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
							name="sort-order">
							{{ option.label }}
						</NcActionRadio>
					</NcActions>
				</template>
			</NcAppNavigationSearch>
		</template>
		<template #list>
			<div v-if="loading" class="sidebar-empty-state">
				<NcLoadingIcon :size="32" />
			</div>
			<p v-else-if="files.length === 0" class="sidebar-empty-state">
				No org files found in your notes folder. Use the
				<strong>Settings</strong> button below to change the folder.
			</p>
			<p v-else-if="sortedFiles.length === 0" class="sidebar-empty-state">
				No files match your filter.
			</p>
			<template v-else-if="fileGroups">
				<div
					v-for="group in fileGroups"
					:key="group.label"
					class="file-group">
					<p class="file-group__header">{{ group.label }}</p>
					<FileList :files="group.files" />
				</div>
			</template>
			<FileList v-else :files="sortedFiles" />
		</template>
		<template #footer>
			<div class="sidebar-footer">
				<NcButton
					:href="settingsUrl"
					aria-label="Settings"
					variant="tertiary">
					<template #icon>
						<NcIconSvgWrapper :path="cogPath" :size="20" />
					</template>
				</NcButton>
			</div>
		</template>
	</NcAppNavigation>
</template>

<script>
import { computed, defineComponent, ref, watch } from 'vue'
import NcActionRadio from '@nextcloud/vue/components/NcActionRadio'
import NcActions from '@nextcloud/vue/components/NcActions'
import NcAppNavigation from '@nextcloud/vue/components/NcAppNavigation'
import NcAppNavigationSearch from '@nextcloud/vue/components/NcAppNavigationSearch'
import NcButton from '@nextcloud/vue/components/NcButton'
import NcIconSvgWrapper from '@nextcloud/vue/components/NcIconSvgWrapper'
import NcLoadingIcon from '@nextcloud/vue/components/NcLoadingIcon'
import FileList from './FileList.vue'

// MDI cog icon path
const cogPath =
	'M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.21,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.68 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z'

export default defineComponent({
	name: 'OrgSidebar',

	components: {
		NcAppNavigation,
		NcAppNavigationSearch,
		NcActions,
		NcActionRadio,
		NcButton,
		NcIconSvgWrapper,
		NcLoadingIcon,
		FileList,
	},

	props: {
		files: {
			type: Array,
			required: true,
		},

		loading: {
			type: Boolean,
			default: false,
		},
	},

	setup(props) {
		const filterQuery = ref('')
		const sortOrder = ref('mtime-desc')

		const settingsUrl =
			window.OC?.generateUrl('/settings/user/orgnotes')
			?? '/settings/user/orgnotes'

		const sortOptions = [
			{ value: 'mtime-desc', label: 'Modified newest' },
			{ value: 'mtime-asc', label: 'Modified oldest' },
			{ value: 'name-asc', label: 'Name A→Z' },
			{ value: 'name-desc', label: 'Name Z→A' },
		]

		let debounceTimer = null
		const filteredFiles = ref([])

		watch(
			[() => props.files, filterQuery],
			([newFiles, newQuery]) => {
				clearTimeout(debounceTimer)
				debounceTimer = setTimeout(() => {
					const q = newQuery.toLowerCase()
					filteredFiles.value = q
						? newFiles.filter((f) =>
								(f.title ?? f.name).toLowerCase().includes(q),
							)
						: newFiles
				}, 150)
			},
			{ immediate: true },
		)

		const sortedFiles = computed(() => {
			const list = [...filteredFiles.value]
			if (sortOrder.value === 'name-asc') {
				list.sort((a, b) =>
					(a.title ?? a.name).localeCompare(b.title ?? b.name),
				)
			} else if (sortOrder.value === 'name-desc') {
				list.sort((a, b) =>
					(b.title ?? b.name).localeCompare(a.title ?? a.name),
				)
			} else if (sortOrder.value === 'mtime-asc') {
				list.sort((a, b) => a.mtime - b.mtime)
			} else {
				list.sort((a, b) => b.mtime - a.mtime)
			}
			return list
		})

		/**
		 *
		 */
		function getBucketBoundaries() {
			const now = new Date()
			const startOfToday = new Date(
				now.getFullYear(),
				now.getMonth(),
				now.getDate(),
			)
			const startOfYesterday = new Date(startOfToday)
			startOfYesterday.setDate(startOfYesterday.getDate() - 1)
			const startOfWeek = new Date(startOfToday)
			const dayOfWeek = startOfToday.getDay() // 0=Sun
			const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1
			startOfWeek.setDate(startOfWeek.getDate() - daysFromMonday)
			const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
			return { startOfToday, startOfYesterday, startOfWeek, startOfMonth }
		}

		/**
		 * Returns a human-readable month label, including the year when it differs from the current year.
		 *
		 * @param {number} year Full year of the month being labelled
		 * @param {number} monthIndex Zero-based month index (0 = January)
		 * @param {number} currentYear The current year, used to omit the year suffix when redundant
		 */
		function monthLabel(year, monthIndex, currentYear) {
			const name = new Date(year, monthIndex, 1).toLocaleString('default', {
				month: 'long',
			})
			return year === currentYear ? name : `${name} ${year}`
		}

		const fileGroups = computed(() => {
			if (sortOrder.value !== 'mtime-desc' && sortOrder.value !== 'mtime-asc')
				return null

			const { startOfToday, startOfYesterday, startOfWeek, startOfMonth } =
				getBucketBoundaries()
			const todayMs = startOfToday.getTime()
			const yesterdayMs = startOfYesterday.getTime()
			const weekMs = startOfWeek.getTime()
			const monthMs = startOfMonth.getTime()
			const currentYear = startOfToday.getFullYear()

			const buckets = {
				today: [],
				yesterday: [],
				thisWeek: [],
				thisMonth: [],
				monthly: {},
			}

			for (const file of sortedFiles.value) {
				const ts = file.mtime * 1000
				if (ts >= todayMs) {
					buckets.today.push(file)
				} else if (ts >= yesterdayMs) {
					buckets.yesterday.push(file)
				} else if (ts >= weekMs) {
					buckets.thisWeek.push(file)
				} else if (ts >= monthMs) {
					buckets.thisMonth.push(file)
				} else {
					const d = new Date(ts)
					const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
					if (!buckets.monthly[key]) buckets.monthly[key] = []
					buckets.monthly[key].push(file)
				}
			}

			const isDesc = sortOrder.value === 'mtime-desc'
			const monthlyKeys = Object.keys(buckets.monthly).sort()
			if (isDesc) monthlyKeys.reverse()
			const monthlyGroups = monthlyKeys.map((key) => {
				const [yearStr, monthStr] = key.split('-')
				return {
					label: monthLabel(
						Number(yearStr),
						Number(monthStr) - 1,
						currentYear,
					),
					files: buckets.monthly[key],
				}
			})

			const recency = [
				{ label: 'Today', files: buckets.today },
				{ label: 'Yesterday', files: buckets.yesterday },
				{ label: 'This week', files: buckets.thisWeek },
				{ label: 'This month', files: buckets.thisMonth },
			]

			const groups = isDesc
				? [...recency, ...monthlyGroups]
				: [...monthlyGroups, ...recency.reverse()]

			return groups.filter((g) => g.files.length > 0)
		})

		return {
			cogPath,
			filterQuery,
			fileGroups,
			settingsUrl,
			sortedFiles,
			sortOptions,
			sortOrder,
		}
	},
})
</script>

<style scoped>
.file-group__header {
	color: var(--color-text-maxcontrast);
	font-size: 11px;
	font-weight: 600;
	text-transform: uppercase;
	letter-spacing: 0.05em;
	padding: 12px 8px 2px;
	margin: 0;
}

.sidebar-footer {
	display: flex;
	justify-content: flex-end;
	padding: 4px 8px;
}

.sidebar-empty-state {
	color: var(--color-text-maxcontrast);
	font-size: 13px;
	padding: 12px 8px;
	margin: 0;
	display: flex;
	align-items: center;
	justify-content: center;
}
</style>
