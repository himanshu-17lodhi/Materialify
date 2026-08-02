import IconizePlugin from '@/main';
import * as materialIconTheme from '@/material-icon-theme';

export function register(plugin: IconizePlugin): void {
  plugin.addCommand({
    id: 'refresh-automatic-icons',
    name: 'Refresh automatic Material icons',
    callback: () => {
      for (const fileExplorer of plugin.getRegisteredFileExplorers()) {
        materialIconTheme.applyAutomaticIconsToExplorer(plugin, fileExplorer);
      }
    },
  });
}
