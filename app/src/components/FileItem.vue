<template>
	<div
		class="file-item"
		:class="{ 'file-item--active': isActive }"
		:title="file.path"
		@click="open"
	>
		<span class="file-item__name">{{ file.name }}</span>
	</div>
</template>

<script>
import { defineComponent, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export default defineComponent({
	name: 'FileItem',

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

<style scoped>
.file-item {
	padding: 6px 8px;
	border-radius: var(--border-radius, 3px);
	cursor: pointer;
	font-size: 13px;
	color: var(--color-main-text, #222);
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.file-item:hover {
	background: var(--color-background-hover, #f5f5f5);
}

.file-item--active {
	background: var(--color-primary-light, #e8f4fb);
	color: var(--color-primary-element, #0082c9);
	font-weight: bold;
}

.file-item__name {
	display: block;
	overflow: hidden;
	text-overflow: ellipsis;
}
</style>
