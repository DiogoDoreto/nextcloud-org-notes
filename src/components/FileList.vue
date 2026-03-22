<template>
	<div class="file-list">
		<FileItem v-for="file in files" :key="file.path" :file="file" />
	</div>
</template>

<script>
import { defineComponent } from 'vue'
import FileItem from './FileItem.vue'

export default defineComponent({
	name: 'FileList',

	components: { FileItem },

	props: {
		files: {
			type: Array,
			required: true,
		},
	},
})
</script>
