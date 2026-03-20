here's a comprehensive breakdown of everything you'd need to build a dedicated Nextcloud Org Mode app.

---

## Architecture & approach

There are two fundamentally different ways to build a Nextcloud app, and for an Org mode viewer/editor, the classic **PHP + Vue.js app** is the right choice (not an ExApp). ExApps are microservices that run outside Nextcloud and are better for heavy computation or non-PHP backends; a file viewer is tightly integrated with the file system and UI, so you want the native approach.

The app will have two main jobs:

1. **Register as a file handler** so that `.org` files open in your viewer instead of the default text display
2. **Parse and render Org syntax** in the browser using a JavaScript library

Here's how the pieces fit together:---

## File access: how your app reads the stored `.org` files

This is one of the most important pieces. Nextcloud exposes user files through `OCP\Files\IRootFolder`. You inject it into your controller/service via dependency injection, then call `getUserFolder('username')` to get a `Folder` object — from there you can call `get('path/to/file.org')` to retrieve a `File` node and `getContent()` to read its text content.

The file is already there — your app doesn't need to import anything. It accesses whatever `.org` files the user already has in their Nextcloud storage. In your PHP controller it looks roughly like:

```php
use OCP\Files\IRootFolder;

class OrgController extends Controller {
    public function __construct(
        string $AppName,
        IRequest $request,
        private IRootFolder $rootFolder,
        private string $userId
    ) { parent::__construct($AppName, $request); }

    /** @NoAdminRequired */
    public function getFile(string $path): DataResponse {
        $userFolder = $this->rootFolder->getUserFolder($this->userId);
        $file = $userFolder->get($path);        // throws NotFoundException if missing
        return new DataResponse(['content' => $file->getContent()]);
    }

    /** @NoAdminRequired */
    public function saveFile(string $path, string $content): DataResponse {
        $userFolder = $this->rootFolder->getUserFolder($this->userId);
        $file = $userFolder->get($path);
        $file->putContent($content);
        return new DataResponse([]);
    }
}
```

---

## Registering `.org` as a known file type

Nextcloud needs to know that `.org` files have their own MIME type so the file list shows the right icon and the viewer knows which handler to open them with. You do this in two places:

**1. `appinfo/mimetypemapping.json`** (ships with your app):
```json
{ "org": ["text/org"] }
```

**2. `appinfo/mimetypealiases.json`** (optional icon hint):
```json
{ "text/org": "text" }
```

Then on the JavaScript side, you register a handler with Nextcloud's Viewer framework using `registerHandler` from `@nextcloud/viewer`. You provide an `id`, the list of MIME types your component handles, and the Vue component that will render the file — the `path` and `mime` props are automatically passed to it by the viewer.

```js
import { registerHandler } from '@nextcloud/viewer'
import OrgView from './OrgView.vue'

registerHandler({
  id: 'org-mode',
  mimes: ['text/org'],
  component: OrgView,
})
```

---

## Org parsing in JavaScript: the parser choice

**uniorg** is an accurate Org-mode parser for JavaScript/TypeScript that follows the Org Syntax spec and draws heavily from `org-element.el` — meaning it parses files the same way Emacs does. It integrates with the `unified` ecosystem, so syntax highlighting via `rehype-highlight` and LaTeX via `rehype-katex` work out of the box. This is the strongest option for a first-party-accurate Org experience.

The basic pipeline in your `OrgView.vue`:
```js
import { unified } from 'unified'
import parse from 'uniorg-parse'
import uniorg2rehype from 'uniorg-rehype'
import stringify from 'rehype-stringify'
import highlight from 'rehype-highlight'

const processor = unified()
  .use(parse)
  .use(uniorg2rehype)
  .use(highlight)
  .use(stringify)

const html = (await processor.process(orgContent)).value
```

An alternative is **orgajs** (orga), which also parses Org content into an AST and integrates natively with the unified ecosystem — it's the same plugin architecture, so code highlight and other rehype plugins work the same way. uniorg tends to be the more spec-faithful choice; orga has a slightly larger ecosystem of examples.

---

## Project structure

Nextcloud provides an official app template on GitHub and an App generator on the App Store that pre-fills all constants like your App ID and namespace — the recommended starting point. The resulting directory structure would look like this:

```
nextcloud-org/
├── appinfo/
│   ├── info.xml                  # App metadata, version, author, NC version compat
│   ├── routes.php                # URL routing (GET /file, PUT /file, etc.)
│   ├── mimetypemapping.json      # Register text/org for .org extension
│   └── mimetypealiases.json      # Icon fallback
├── lib/
│   ├── AppInfo/
│   │   └── Application.php       # App bootstrap, DI container setup
│   ├── Controller/
│   │   └── OrgController.php     # REST endpoints (getFile, saveFile)
│   └── Service/
│       └── OrgFileService.php    # Business logic, IRootFolder usage
├── src/
│   ├── main.js                   # Registers the Viewer handler
│   ├── views/
│   │   ├── OrgView.vue           # Main viewer/editor component
│   │   └── AgendaView.vue        # Optional: TODO/tag/date aggregation
│   └── components/
│       ├── OrgHeading.vue        # Collapsible headings
│       ├── OrgTable.vue          # Org table rendering
│       └── OrgTodo.vue           # TODO keywords with state cycling
├── img/
│   └── app.svg                   # App icon
├── l10n/                         # Translations
├── webpack.config.js
├── package.json
└── composer.json
```

---

## The viewer/editor Vue component

The `OrgView.vue` component receives `path` and `mime` from the Nextcloud Viewer automatically. Its job is to:

1. Fetch the file content via your OCS endpoint
2. Parse it with uniorg
3. Render the HTML (view mode)
4. Optionally switch to raw text editing and save back

A key design decision early on: **do you want view-only, or a proper editor?** A view-only renderer is much simpler to build and already a massive improvement over the Notes app. A full editor (with live preview, folding headings, TODO cycling) is a larger project. A reasonable phased approach:

- **Phase 1**: View mode — render the Org file as formatted HTML with proper headings, code blocks, tables, links
- **Phase 2**: Raw text edit mode — a `<textarea>` or CodeMirror with Org syntax highlighting and save
- **Phase 3**: Rich editing — heading folding, TODO state cycling, inline preview

---

## Getting access to existing files: the key insight

Your stored `.org` files need **no migration**. The app accesses them exactly where they are via `IRootFolder`. The user's files at `/Documents/notes.org` are available at `getUserFolder(userId)->get('Documents/notes.org')`. Additionally, you can register a **file action** via `OCA.Files.fileActions.registerAction()` so that a context menu item "Open in Org Viewer" appears when the user right-clicks any `.org` file in the Files app — this complements the Viewer handler for inline viewing.

---

## Development environment

The recommended dev setup is the Nextcloud Docker environment. With it running, you place your app in `nextcloud-docker-dev/workspace/server/apps-extra/` and enable it via `occ app:enable org`. The frontend is built with `npm run dev` (watch mode) while PHP changes are picked up immediately.

For the frontend toolchain you'll need:
```json
{
  "dependencies": {
    "uniorg-parse": "^...",
    "uniorg-rehype": "^...",
    "rehype-stringify": "^...",
    "rehype-highlight": "^...",
    "unified": "^...",
    "@nextcloud/viewer": "^...",
    "@nextcloud/axios": "^..."
  },
  "devDependencies": {
    "@nextcloud/webpack-vue-config": "^...",
    "vue": "^2.x"
  }
}
```

Note: Nextcloud currently uses **Vue 2** in most of the ecosystem, though Hub 10+ apps can opt into Vue 3. Check the version of `@nextcloud/webpack-vue-config` you pick — it determines which Vue you get.

---

## Publishing to the App Store

To publish to the Nextcloud App Store, you need to sign your app with a certificate. You generate a CSR, submit it as a pull request to Nextcloud's certificate repository, and once approved you can sign your releases. App IDs must contain only lowercase ASCII letters and underscores.

---

## Summary of what makes this project unique vs. just extending Notes

The Notes app is tightly coupled to Markdown — its editor, preview, and storage assumptions are all Markdown-first, which is why extending it is a dead end. A standalone app gives you:

- **Clean MIME type registration** — `.org` files open in your app automatically
- **Full Org syntax support** — headings with levels, TODO keywords, tags, timestamps, drawers, code blocks with language-aware highlighting, tables, links, footnotes
- **Agenda-like view** — you can scan across multiple files for TODO items or scheduled dates using `IRootFolder`'s search/traversal APIs
- **Non-destructive** — your existing files are untouched; the app is read/write on top of them

The hardest part of this project isn't the Nextcloud integration — that's fairly well-documented. The hardest part is **org parsing fidelity**: Org mode has a lot of edge cases (e.g. the interaction between indentation, list continuation, and drawer boundaries). uniorg is the best JavaScript parser for this, but you may still hit parsing gaps for advanced syntax. Starting with a read-only renderer and iterating from there is the pragmatic path.
