import IconizePlugin from '@/main';

import { MarkdownView } from 'obsidian';
import { getAllOpenedFiles } from '@/util';
import titleIcon from '@/lib/icon-title';
import { calculateInlineTitleSize } from '@/utils/text';
import { WorkspaceLeaf } from 'obsidian';

import iconTabs from '@/lib/icon-tabs';
import { TabHeaderLeaf, InlineTitleView } from '@/@types/obsidian';

export function registerWorkspaceEvents(plugin: IconizePlugin): void {
  plugin.registerEvent(
    plugin.app.workspace.on('layout-change', () => {
      plugin.handleChangeLayout();
    }),
  );

  plugin.registerEvent(
    plugin.app.workspace.on('css-change', () => {
      for (const openedFile of getAllOpenedFiles(plugin)) {
        const activeView = openedFile.leaf.view as InlineTitleView;

        if (activeView instanceof MarkdownView) {
          titleIcon.updateStyle(activeView.inlineTitleEl, {
            fontSize: calculateInlineTitleSize(),
          });
        }
      }
    }),
  );

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
          const iconColor = plugin.getIconColor(file.path);

          iconTabs.add(plugin, openedFile.path, leaf.tabHeaderInnerIconEl, {
            iconColor,
          });
        }
        return;
      }

      if (leaf.view.getViewType() !== 'markdown') {
        return;
      }

      const tabHeaderLeaf = leaf as TabHeaderLeaf;
      if (tabHeaderLeaf.view.file) {
        const iconColor = plugin.getIconColor(tabHeaderLeaf.view.file.path);
        iconTabs.add(
          plugin,
          tabHeaderLeaf.view.file.path,
          tabHeaderLeaf.tabHeaderInnerIconEl,
          {
            iconColor,
          },
        );
      }
    }),
  );
}
