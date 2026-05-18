import { Setting } from 'obsidian';
import IconizePlugin from '@app/main';
import * as materialIconTheme from '@app/material-icon-theme';

export default class ToggleAutomaticMaterialIconTheme {
  private plugin: IconizePlugin;
  private containerEl: HTMLElement;

  constructor(plugin: IconizePlugin, containerEl: HTMLElement) {
    this.plugin = plugin;
    this.containerEl = containerEl;
  }

  public display(): void {
    new Setting(this.containerEl)
      .setName('Enable automatic Material Icon Theme')
      .setDesc(
        'If enabled, files and folders without an explicit icon will automatically be assigned an icon based on the VS Code Material Icon Theme.',
      )
      .addToggle((toggle) => {
        const isEnabled = this.plugin.getSettings().automaticMaterialIconTheme;
        toggle.setValue(isEnabled).onChange(async (enabled) => {
          this.plugin.getSettings().automaticMaterialIconTheme = enabled;
          await this.plugin.saveIconFolderData();

          // Refresh all file explorers
          for (const fileExplorer of this.plugin.getRegisteredFileExplorers()) {
            materialIconTheme.applyAutomaticIconsToExplorer(
              this.plugin,
              fileExplorer,
            );
          }
        });
      })
      .addButton((btn) => {
        btn
          .setButtonText('Force Update')
          .setTooltip('Force apply automatic icons to all items now')
          .onClick(async () => {
            for (const fileExplorer of this.plugin.getRegisteredFileExplorers()) {
              materialIconTheme.applyAutomaticIconsToExplorer(
                this.plugin,
                fileExplorer,
              );
            }
          });
      });
  }
}
