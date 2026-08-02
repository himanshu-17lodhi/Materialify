import IconizePlugin from '@/main';

export function register(plugin: IconizePlugin): void {
  plugin.registerEvent(
    plugin.app.workspace.on('layout-change', () => {
      plugin.handleChangeLayout();
    }),
  );
}
