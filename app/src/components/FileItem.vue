<template>
	<NcAppNavigationItem :name="file.name" :active="isActive" @click="open" />
</template>

<script>
import { defineComponent, computed } from 'vue'
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

		function open() {
			router.push({ query: { file: props.file.path } })
		}

		return { isActive, open }
	},
})
</script>
