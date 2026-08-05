import { MarkdownView } from 'obsidian';
import type { InlineTitleView } from '@/types/obsidian';
import titleIcon from '@/lib/icon-title';
import IconizePlugin from '@/main';
import { getAllOpenedFiles } from '@/util';
import { calculateInlineTitleSize } from '@/utils/text';

export function register(plugin: IconizePlugin): void {
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
