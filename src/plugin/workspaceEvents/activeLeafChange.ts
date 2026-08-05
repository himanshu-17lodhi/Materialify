import { WorkspaceLeaf } from 'obsidian';

import type { TabHeaderLeaf } from '@/types/obsidian';
import iconTabs from '@/lib/icon-tabs';
import IconizePlugin from '@/main';
import { getAllOpenedFiles } from '@/util';

export function register(plugin: IconizePlugin): void {
  plugin.registerEvent(
    plugin.app.workspace.on('active-leaf-change', (leaf: WorkspaceLeaf) => {
      if (!plugin.getSettings().iconInTabsEnabled) {
        return;
      }

      if (leaf.view.getViewType() === 'file-explorer') {
        for (const openedFile of getAllOpenedFiles(plugin)) {
          const leaf = openedFile.leaf as TabHeaderLeaf;
          const file = leaf.view.file;

          if (!file) {
            continue;
          }

          iconTabs.add(plugin, openedFile.path, leaf.tabHeaderInnerIconEl, {
            iconColor: plugin.getIconColor(file.path),
          });
        }

        return;
      }

      if (leaf.view.getViewType() !== 'markdown') {
        return;
      }

      const tabHeaderLeaf = leaf as TabHeaderLeaf;

      if (!tabHeaderLeaf.view.file) {
        return;
      }

      iconTabs.add(
        plugin,
        tabHeaderLeaf.view.file.path,
        tabHeaderLeaf.tabHeaderInnerIconEl,
        {
          iconColor: plugin.getIconColor(tabHeaderLeaf.view.file.path),
        },
      );
    }),
  );
}
