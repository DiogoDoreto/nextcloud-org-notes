import { ref } from 'vue'
import OrgEditor from './OrgEditor.vue'

export default {
	title: 'Components/OrgEditor',
	component: OrgEditor,
	parameters: {
		layout: 'fullscreen',
	},
}

const SAMPLE_ORG = `* Meeting Notes [2024-01-15]

** Agenda

- Project roadmap review
- *Q1 goals* status update
- Action items

** Notes

Discussed the upcoming release. Main concerns:

1. Performance on large files
2. /Mobile/ rendering
3. ~API~ compatibility

** Action Items

*** TODO Alice: write design doc :alice:
*** TODO Bob: prototype feature branch :bob:

** Code Sample

#+BEGIN_SRC python
def render_org(content: str) -> str:
    """Convert org-mode content to HTML."""
    return processor.process(content)
#+END_SRC
`

export const Default = {
	render: () => ({
		components: { OrgEditor },
		setup() {
			const content = ref(SAMPLE_ORG)
			return { content }
		},
		template: `
			<div style="height: 500px; border: 1px solid var(--color-border); border-radius: var(--border-radius);">
				<OrgEditor v-model="content" />
			</div>
		`,
	}),
}

export const Empty = {
	render: () => ({
		components: { OrgEditor },
		setup() {
			const content = ref('')
			return { content }
		},
		template: `
			<div style="height: 500px; border: 1px solid var(--color-border); border-radius: var(--border-radius);">
				<OrgEditor v-model="content" />
			</div>
		`,
	}),
}
