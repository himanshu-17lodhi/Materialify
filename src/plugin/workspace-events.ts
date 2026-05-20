import IconizePlugin from '@/main';

import { MarkdownView } from 'obsidian';
import { getAllOpenedFiles } from '@/util';
import titleIcon from '@/lib/icon-title';
import { calculateInlineTitleSize } from '@/utils/text';
import { InlineTitleView } from '@/@types/obsidian';

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
}
