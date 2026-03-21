<template>
	<NcContent app-name="orgnotes">
		<Sidebar />
		<NcAppContent>
			<OrgView v-if="selectedFile" :path="selectedFile" :full-width="true" />
			<NcEmptyContent v-else name="Select a file" description="Select a file from the sidebar to view it." />
		</NcAppContent>
	</NcContent>
</template>

<script>
import { defineComponent, computed } from 'vue'
import { useRoute } from 'vue-router'
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
		const selectedFile = computed(() => route.query.file || null)
		return { selectedFile }
	},
})
</script>
