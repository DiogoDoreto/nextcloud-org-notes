## 1. Inject main.js via Files event dispatcher

- [x] 1.1 In `Application.php::boot()`, get `IEventDispatcher` from the server container and add a listener for `OCA\Files\Event\LoadAdditionalScriptsEvent` that calls `\OCP\Util::addScript('orgnotes', 'main')`
- [x] 1.2 Run `nix build` to verify the app builds cleanly
- [ ] 1.3 Verify in the browser that `main.js` appears in the network tab when loading the Files app
- [ ] 1.4 Verify that clicking a `.org` file opens the Org viewer modal instead of the plain text preview
