<template>
	<div class="filter-input">
		<input
			v-model="query"
			type="text"
			placeholder="Filter files..."
			class="filter-input__field"
		/>
	</div>
</template>

<script>
import { defineComponent, ref, watch } from 'vue'

export default defineComponent({
	name: 'FilterInput',

	props: {
		files: {
			type: Array,
			required: true,
		},
	},

	emits: ['update:filtered'],

	setup(props, { emit }) {
		const query = ref('')
		let debounceTimer = null

		watch(query, (val) => {
			clearTimeout(debounceTimer)
			debounceTimer = setTimeout(() => {
				const q = val.toLowerCase()
				const filtered = q
					? props.files.filter(f => f.name.toLowerCase().includes(q))
					: props.files
				emit('update:filtered', filtered)
			}, 150)
		})

		watch(() => props.files, (files) => {
			const q = query.value.toLowerCase()
			const filtered = q
				? files.filter(f => f.name.toLowerCase().includes(q))
				: files
			emit('update:filtered', filtered)
		})

		return { query }
	},
})
</script>

<style scoped>
.filter-input {
	margin-bottom: 8px;
}

.filter-input__field {
	width: 100%;
	box-sizing: border-box;
	padding: 6px 8px;
	border: 1px solid var(--color-border, #ededed);
	border-radius: var(--border-radius, 3px);
	background: var(--color-main-background, #fff);
	color: var(--color-main-text, #222);
	font-size: 13px;
}
</style>
