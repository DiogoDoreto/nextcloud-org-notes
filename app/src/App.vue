<template>
	<div class="org-browser">
		<aside class="org-browser__sidebar">
			<Sidebar />
		</aside>
		<main class="org-browser__main">
			<OrgView v-if="selectedFile" :path="selectedFile" :full-width="true" />
			<div v-else class="org-browser__empty">
				<p>Select a file from the sidebar to view it.</p>
			</div>
		</main>
	</div>
</template>

<script>
import { defineComponent, computed } from 'vue'
import { useRoute } from 'vue-router'
import Sidebar from './components/Sidebar.vue'
import OrgView from './views/OrgView.vue'

export default defineComponent({
	name: 'OrgBrowser',

	components: { Sidebar, OrgView },

	setup() {
		const route = useRoute()
		const selectedFile = computed(() => route.query.file || null)
		return { selectedFile }
	},
})
</script>

<style scoped>
.org-browser {
	display: flex;
	height: 100%;
	overflow: hidden;
}

.org-browser__sidebar {
	width: 280px;
	min-width: 200px;
	border-right: 1px solid var(--color-border, #ededed);
	overflow-y: auto;
	flex-shrink: 0;
}

.org-browser__main {
	flex: 1;
	overflow-y: auto;
}

.org-browser__empty {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 100%;
	color: var(--color-text-maxcontrast, #6d6d6d);
}
</style>
