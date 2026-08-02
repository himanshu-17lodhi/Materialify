import { EditorWithEditorComponent } from '@/@types/obsidian';
import { IconCache } from '@/lib/icon-cache';
import iconTabs from '@/lib/icon-tabs';
import { logger } from '@/lib/logger-service';
import IconizePlugin from '@/main';
import IconsPickerModal from '@/ui/icons-picker-modal';

export function register(plugin: IconizePlugin): void {
  plugin.addCommand({
    id: 'materialify:set-file-icon',
    name: 'Set file icon',
    hotkeys: [
      {
        modifiers: ['Mod', 'Shift'],
        key: 'j',
      },
    ],
    editorCallback: async (editor: EditorWithEditorComponent) => {
      const file = editor.editorComponent?.file;

      if (!file) {
        logger.warn(
          `'editor.editorComponent?.file' is undefined for file: ${file}`,
        );
        return;
      }

      const modal = new IconsPickerModal(plugin.app, plugin, file.path);
      modal.open();

      modal.onSelect = (iconName: string): void => {
        IconCache.getInstance().set(file.path, {
          iconNameWithPrefix: iconName,
        });

        if (plugin.getSettings().iconInTabsEnabled) {
          const tabLeaves = iconTabs.getTabLeavesOfFilePath(plugin, file.path);

          for (const tabLeaf of tabLeaves) {
            iconTabs.update(plugin, iconName, tabLeaf.tabHeaderInnerIconEl);
          }
        }

        if (plugin.getSettings().iconInTitleEnabled) {
          plugin.addIconInTitle(iconName);
        }
      };
    },
  });
}
