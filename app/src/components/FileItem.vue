<template>
	<NcAppNavigationItem :name="file.name" :to="{ query: { file: file.path } }" />
</template>

<script>
import { defineComponent } from 'vue'
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
})
</script>
