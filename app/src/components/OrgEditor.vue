<template>
	<div class="org-editor">
		<div class="org-editor__toolbar">
			<NcButton type="tertiary" :aria-label="'Bold'" title="Bold (*)" @click="applyFormat('*')">
				<template #icon><strong>B</strong></template>
			</NcButton>
			<NcButton type="tertiary" :aria-label="'Italic'" title="Italic (/)" @click="applyFormat('/')">
				<template #icon><em>I</em></template>
			</NcButton>
			<NcButton type="tertiary" :aria-label="'Verbatim'" title="Verbatim (=)" @click="applyFormat('=')">
				<template #icon><code>=</code></template>
			</NcButton>
			<NcButton type="tertiary" :aria-label="'Code'" title="Code (~)" @click="applyFormat('~')">
				<template #icon><code>~</code></template>
			</NcButton>
		</div>
		<Codemirror
			:model-value="modelValue"
			:extensions="extensions"
			class="org-editor__cm"
			@ready="onReady"
			@update:model-value="$emit('update:modelValue', $event)" />
	</div>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { Codemirror } from 'vue-codemirror'
import { basicSetup } from 'codemirror'
import { EditorSelection } from '@codemirror/state'
import NcButton from '@nextcloud/vue/components/NcButton'

function wrapSelection(delim) {
	return (view) => {
		const changes = view.state.changeByRange((range) => {
			const text = view.state.sliceDoc(range.from, range.to)
			const insert = delim + text + delim
			return {
				range: EditorSelection.range(range.from, range.from + insert.length),
				changes: { from: range.from, to: range.to, insert },
			}
		})
		view.dispatch(changes)
		return true
	}
}

export default defineComponent({
	name: 'OrgEditor',

	components: { Codemirror, NcButton },

	props: {
		modelValue: {
			type: String,
			required: true,
		},
	},

	emits: ['update:modelValue'],

	setup() {
		const editorView = ref(null)
		const extensions = [basicSetup]

		function onReady({ view }) {
			editorView.value = view
		}

		function applyFormat(delim) {
			if (!editorView.value) return
			wrapSelection(delim)(editorView.value)
			editorView.value.focus()
		}

		return { extensions, onReady, applyFormat }
	},
})
</script>

<style scoped>
.org-editor {
	display: flex;
	flex-direction: column;
	height: 100%;
}

.org-editor__toolbar {
	display: flex;
	align-items: center;
	gap: 4px;
	padding: 4px 8px;
	border-bottom: 1px solid var(--color-border);
	flex-shrink: 0;
}

.org-editor__cm {
	flex: 1;
	overflow: auto;
	font-family: monospace;
	font-size: 0.95em;
}
</style>

<style>
.org-editor__cm .cm-editor {
	height: 100%;
}

.org-editor__cm .cm-scroller {
	font-family: monospace;
}
</style>
