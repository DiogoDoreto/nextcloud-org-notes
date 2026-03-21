<template>
	<div class="sort-control">
		<select
			:value="modelValue"
			class="sort-control__select"
			@change="$emit('update:modelValue', $event.target.value)"
		>
			<option value="mtime-desc">Modified newest</option>
			<option value="mtime-asc">Modified oldest</option>
			<option value="name-asc">Name A→Z</option>
			<option value="name-desc">Name Z→A</option>
		</select>
	</div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'SortControl',

	props: {
		modelValue: {
			type: String,
			default: 'mtime-desc',
		},
	},

	emits: ['update:modelValue'],
})
</script>

<style scoped>
.sort-control {
	margin-bottom: 8px;
}

.sort-control__select {
	width: 100%;
	padding: 6px 8px;
	border: 1px solid var(--color-border, #ededed);
	border-radius: var(--border-radius, 3px);
	background: var(--color-main-background, #fff);
	color: var(--color-main-text, #222);
	font-size: 13px;
}
</style>
