export function unloadPlugin(plugin: any) {
    console.log("Unloading... cleaning up");

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
    document.querySelectorAll(".iconize-icon").forEach((el) => {
        el.remove();
    });

    plugin.frontmatterCache.clear();
    plugin.api = undefined;
}