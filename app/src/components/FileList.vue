<template>
	<div class="file-list">
		<p v-if="files.length === 0" class="file-list__empty">No files found.</p>
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

<style scoped>
.file-list__empty {
	color: var(--color-text-maxcontrast, #6d6d6d);
	font-size: 13px;
	padding: 8px 0;
}
</style>
