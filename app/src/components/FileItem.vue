<template>
	<NcAppNavigationItem
		:name="file.title ?? file.name"
		:active="isActive"
		@click="open" />
</template>

<script>
import { computed, defineComponent } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import NcAppNavigationItem from '@nextcloud/vue/components/NcAppNavigationItem'

export default defineComponent({
	name: 'FileItem',

	components: { NcAppNavigationItem },

	props: {
		file: {
			type: Object,
			required: true,
		},
	},

	setup(props) {
		const route = useRoute()
		const router = useRouter()

		const isActive = computed(() => route.query.file === props.file.path)

		/**
		 *
		 * @param event
		 */
		function open(event) {
			event?.preventDefault()
			router.push({ query: { file: props.file.path } })
		}

		return { isActive, open }
	},
})
</script>
