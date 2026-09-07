export function unloadPlugin(plugin: any) {
    console.log("Unloading Iconize - cleaning up");

    if (plugin.automaticIconRefreshTimeout !== null) {
        window.clearTimeout(plugin.automaticIconRefreshTimeout);
        plugin.automaticIconRefreshTimeout = null;
    }

    plugin.automaticIconRefreshQueue.clear();
    for (const fileExplorer of plugin.registeredFileExplorers) {
        if (fileExplorer.materialIconObserver) {
            fileExplorer.materialIconObserver.disconnect();
            fileExplorer.materialIconObserver = null;
        }
    }

    for (const fileExplorer of plugin.getRegisteredFileExplorers()) {
        fileExplorer.containerEl
            .querySelectorAll(".iconize-icon")
            .forEach((el: HTMLElement) => el.remove());
    }

    plugin.app.workspace.iterateAllLeaves((leaf: any) => {
        const title = leaf.view?.inlineTitleEl;

        if (title) {
            title.parentElement
                ?.querySelectorAll(".iconize-icon")
                .forEach((el: HTMLElement) => el.remove());
        }
    });

    plugin.frontmatterCache.clear();
    plugin.api = undefined;

    console.log("Iconize cleanup complete");
}