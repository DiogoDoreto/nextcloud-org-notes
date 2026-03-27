import OrgView from './OrgView.vue'

export default {
	title: 'Components/OrgView',
	component: OrgView,
	parameters: {
		layout: 'padded',
	},
	argTypes: {
		content: { control: 'text' },
		fullWidth: { control: 'boolean' },
	},
}

const RICH_ORG = `#+TITLE: Sample Org Document

* Introduction

This is a sample /org-mode/ document rendered by *Nextcloud Org Notes*.
It demonstrates the supported markup without needing a running Nextcloud instance.

** Inline Markup

You can write *bold*, /italic/, _underline_, =verbatim=, and ~code~ text.
Strikethrough uses +plus signs+ around the text.

** Lists

Unordered:

- Item one
- Item two
  - Nested item
  - Another nested item
- Item three

Ordered:

1. First step
2. Second step
3. Third step

Definition list:

- Term A :: First definition
- Term B :: Second definition

** TODO Tasks

*** TODO Buy groceries [#A] :shopping:errands:
*** DONE Write documentation :work:
*** FIXME Fix the rendering bug :bug:

** Code Block

#+BEGIN_SRC javascript
function greet(name) {
  return \`Hello, \${name}!\`
}

greet('World')
#+END_SRC

** Table

| Name  | Role     | Status |
|-------|----------|--------|
| Alice | Engineer | Active |
| Bob   | Designer | Active |
| Carol | Manager  | Away   |

** Blockquote

#+BEGIN_QUOTE
The best way to predict the future is to invent it.
— Alan Kay
#+END_QUOTE

** Horizontal Rule

-----

** Links

Visit [[https://orgmode.org][Org Mode]] for the full specification.
`

const SIMPLE_ORG = `* Hello World

Just a simple org file with a single heading and a paragraph.

Some *bold* and /italic/ text, plus a list:

- One
- Two
- Three
`

export const Rich = {
	args: {
		content: RICH_ORG,
		fullWidth: false,
	},
}

export const FullWidth = {
	args: {
		content: RICH_ORG,
		fullWidth: true,
	},
}

export const Simple = {
	args: {
		content: SIMPLE_ORG,
	},
}

export const Empty = {
	args: {
		content: '',
	},
}
