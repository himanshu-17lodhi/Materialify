import type { InlineTitleView } from '@/types/obsidian';
import emoji from '@/emoji';
import icon from '@/lib/icon';
import titleIcon from '@/lib/icon-title';
import IconizePlugin from '@/main';
import { getAllOpenedFiles } from '@/util';
import { calculateInlineTitleSize } from '@/utils/text';

export function register(plugin: IconizePlugin): void {
  plugin.registerEvent(
    plugin.app.workspace.on('file-open', (file) => {
      if (!plugin.getSettings().iconInTitleEnabled) {
        return;
      }

      for (const openedFile of getAllOpenedFiles(plugin)) {
        if (!file || !openedFile || openedFile.path !== file.path) {
          continue;
        }

        const leaf = openedFile.leaf.view as InlineTitleView;
        const iconNameWithPrefix = icon.getByPath(plugin, file.path);

        if (!iconNameWithPrefix) {
          titleIcon.hide(leaf.inlineTitleEl);
          return;
        }

        let foundIcon: string | undefined = iconNameWithPrefix;

        if (!emoji.isEmoji(foundIcon)) {
          foundIcon = icon.getIconByName(
            plugin,
            iconNameWithPrefix,
          )?.svgElement;

          if (
            !foundIcon &&
            plugin.iconPackManager.getPreloadedIcons().length > 0
          ) {
            foundIcon = plugin.iconPackManager
              .getPreloadedIcons()
              .find(
                (icon) => icon.prefix + icon.name === iconNameWithPrefix,
              )?.svgElement;
          }
        }

        if (foundIcon) {
          titleIcon.add(plugin, leaf.inlineTitleEl, foundIcon, {
            fontSize: calculateInlineTitleSize(),
          });
        } else {
          titleIcon.hide(leaf.inlineTitleEl);
        }
      }
    }),
  );
}
