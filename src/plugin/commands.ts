import { EditorWithEditorComponent } from '@/@types/obsidian';
import { IconCache } from '@/lib/icon-cache';
import iconTabs from '@/lib/icon-tabs';
import { logger } from '@/lib/logger-service';
import IconizePlugin from '@/main';
import * as materialIconTheme from '@/material-icon-theme';
import IconsPickerModal from '@/ui/icons-picker-modal';

export function registerCommands(plugin: IconizePlugin): void {
  /** Command Automatically refresh Material icons */
  plugin.addCommand({
    id: 'refresh-automatic-icons',
    name: 'Refresh automatic Material icons',
    callback: () => {
      for (const fileExplorer of plugin.getRegisteredFileExplorers()) {
        materialIconTheme.applyAutomaticIconsToExplorer(plugin, fileExplorer);
      }
    },
  });

  /** Command Set icon for file */
  plugin.addCommand({
    id: 'iconize:set-icon-for-file',
    name: 'Set icon for file',
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

        // Update icon in tab when setting is enabled.
        if (plugin.getSettings().iconInTabsEnabled) {
          const tabLeaves = iconTabs.getTabLeavesOfFilePath(plugin, file.path);
          for (const tabLeaf of tabLeaves) {
            iconTabs.update(plugin, iconName, tabLeaf.tabHeaderInnerIconEl);
          }
        }

        // Update icon in title when setting is enabled.
        if (plugin.getSettings().iconInTitleEnabled) {
          plugin.addIconInTitle(iconName);
        }
      };
    },
  });
}
