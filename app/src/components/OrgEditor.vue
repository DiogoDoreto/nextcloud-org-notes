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
import { EditorView } from '@codemirror/view'
import NcButton from '@nextcloud/vue/components/NcButton'

const nextcloudTheme = EditorView.theme({
	'&': {
		color: 'var(--color-main-text)',
		backgroundColor: 'var(--color-main-background)',
		height: '100%',
	},
	'&.cm-focused': {
		outline: '2px solid var(--color-primary-element)',
		outlineOffset: '-2px',
	},
	'.cm-content': {
		caretColor: 'var(--color-main-text)',
		fontFamily: 'monospace',
		padding: '8px 0',
		border: 'none !important',
		backgroundColor: 'transparent !important',
	},
	'.cm-cursor, .cm-dropCursor': {
		borderLeftColor: 'var(--color-main-text)',
	},
	'&.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground, .cm-selectionBackground': {
		backgroundColor: 'color-mix(in srgb, var(--color-primary-element) 45%, transparent)',
	},
	'::selection': {
		backgroundColor: 'color-mix(in srgb, var(--color-primary-element) 45%, transparent)',
		color: 'var(--color-main-text)',
	},
	'.cm-gutters': {
		backgroundColor: 'var(--color-background-dark)',
		color: 'var(--color-text-maxcontrast)',
		border: 'none',
		borderRight: '1px solid var(--color-border)',
	},
	'.cm-lineNumbers .cm-gutterElement': {
		color: 'var(--color-text-maxcontrast)',
	},
	'.cm-activeLineGutter': {
		backgroundColor: 'var(--color-background-hover)',
		color: 'var(--color-main-text)',
	},
	'.cm-activeLine': {
		backgroundColor: 'color-mix(in srgb, var(--color-main-text) 6%, transparent)',
	},
	'.cm-matchingBracket': {
		backgroundColor: 'var(--color-background-dark)',
		outline: '1px solid var(--color-border-dark)',
	},
	'.cm-tooltip': {
		backgroundColor: 'var(--color-main-background)',
		border: '1px solid var(--color-border)',
		borderRadius: 'var(--border-radius, 3px)',
		color: 'var(--color-main-text)',
	},
	'.cm-panels': {
		backgroundColor: 'var(--color-background-dark)',
		color: 'var(--color-main-text)',
	},
	'.cm-searchMatch': {
		backgroundColor: 'color-mix(in srgb, var(--color-warning) 30%, transparent)',
		outline: '1px solid var(--color-warning)',
	},
	'.cm-searchMatch.cm-searchMatch-selected': {
		backgroundColor: 'color-mix(in srgb, var(--color-primary-element) 40%, transparent)',
	},
})

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
		const extensions = [basicSetup, nextcloudTheme]

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
	font-size: 0.95em;
}
</style>

<style>
.org-editor__cm .cm-scroller {
	font-family: monospace;
}
</style>
