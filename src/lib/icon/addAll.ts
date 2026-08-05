import type { ExplorerView, TabHeaderLeaf } from '@/types/obsidian';

import config from '@/config';
import customRule from '@/lib/customRule';
import { IconCache } from '@/lib/icon-cache';
import iconTabs from '@/lib/icon-tabs';
import * as materialIconTheme from '@/materialifyIcons';
import IconizePlugin, { FolderIconObject } from '@/main';
import { getFileItemInnerTitleEl, getFileItemTitleEl } from '@/util';
import dom from '@/utils/dom';

import { requireApiVersion } from 'obsidian';

export default function addAll(
  plugin: IconizePlugin,
  data: [string, string | FolderIconObject][],
  registeredFileExplorers: WeakSet<ExplorerView>,
  callback?: () => void,
): void {
  const fileExplorers = plugin.app.workspace.getLeavesOfType('file-explorer');

  for (const fileExplorer of fileExplorers) {
    if (registeredFileExplorers.has(fileExplorer.view)) {
      continue;
    }

    registeredFileExplorers.add(fileExplorer.view);

    const setIcons = async () => {
      if (plugin.getSettings().iconInTabsEnabled) {
        for (const leaf of plugin.app.workspace.getLeavesOfType('markdown')) {
          const filePath = leaf.view.file?.path ?? leaf.view.getState().file;

          if (typeof filePath === 'string') {
            const tabHeaderLeaf = leaf as TabHeaderLeaf;
            const iconColor = plugin.getIconColor(filePath);

            iconTabs.add(plugin, filePath, tabHeaderLeaf.tabHeaderInnerIconEl, {
              iconColor,
            });
          }
        }
      }

      for (const [dataPath, value] of data) {
        const fileItem = fileExplorer.view.fileItems[dataPath];

        if (!fileItem) {
          continue;
        }

        const titleEl = getFileItemTitleEl(fileItem);
        const titleInnerEl = getFileItemInnerTitleEl(fileItem);

        if (titleEl.children.length !== 1 && titleEl.children.length !== 2) {
          continue;
        }

        const iconName = typeof value === 'string' ? value : value.iconName;

        const iconColor =
          typeof value === 'string' ? undefined : value.iconColor;

        if (!iconName) {
          continue;
        }

        const existingIcon = titleEl.querySelector('.iconize-icon');

        if (existingIcon) {
          existingIcon.remove();
        }

        const iconNode = titleEl.createDiv();

        iconNode.setAttribute(config.attributes.icon, iconName);
        iconNode.classList.add('iconize-icon');

        IconCache.getInstance().set(dataPath, {
          iconNameWithPrefix: iconName,
        });

        dom.setIconForNode(plugin, iconName, iconNode, {
          color: iconColor,
        });

        titleEl.insertBefore(iconNode, titleInnerEl);
      }

      for (const rule of customRule.getSortedRules(plugin)) {
        await customRule.addToAllFiles(plugin, rule);
      }

      materialIconTheme.applyAutomaticIconsToExplorer(
        plugin,
        fileExplorer.view,
      );

      callback?.();
    };

    if (requireApiVersion('1.7.2')) {
      fileExplorer.loadIfDeferred().then(() => {
        void setIcons();
      });
    } else {
      void setIcons();
    }
  }
}
