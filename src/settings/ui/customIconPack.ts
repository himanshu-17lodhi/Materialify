import { Notice, Setting, TextComponent } from 'obsidian';
import IconFolderSetting from './iconFolderSetting';
import IconizePlugin from '@/main';
import { readFileSync } from '@/util';

export default class CustomIconsSetting extends IconFolderSetting {
  private textComponent: TextComponent;
  private dragOverElement: HTMLElement;
  private closeTimer: NodeJS.Timeout;
  private dragTargetElement: HTMLElement;
  private refreshDisplay: () => void;

  constructor(
    plugin: IconizePlugin,
    containerEl: HTMLElement,
    refreshDisplay: () => void,
  ) {
    super(plugin, containerEl);
    this.refreshDisplay = refreshDisplay;
    this.dragOverElement = document.createElement('div');
    this.dragOverElement.addClass('iconize-dragover-el');
    this.dragOverElement.style.display = 'hidden';
    this.dragOverElement.innerHTML = '<p>Drop to add icon.</p>';
  }

  private normalizeIconPackName(value: string): string {
    return value.toLowerCase().replace(/\s/g, '-');
  }

  private preventDefaults(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
  }

  private highlight(el: HTMLElement): void {
    clearTimeout(this.closeTimer);

    if (!this.dragTargetElement) {
      el.appendChild(this.dragOverElement);
      el.classList.add('iconize-dragover');
      this.dragTargetElement = el;
    }
  }

  private unhighlight(target: HTMLElement, el: HTMLElement): void {
    if (this.dragTargetElement && this.dragTargetElement !== target) {
      this.dragTargetElement.removeChild(this.dragOverElement);
      this.dragTargetElement.classList.remove('iconize-dragover');
      this.dragTargetElement = undefined;
    }

    clearTimeout(this.closeTimer);
    this.closeTimer = setTimeout(() => {
      if (this.dragTargetElement) {
        el.removeChild(this.dragOverElement);
        el.classList.remove('iconize-dragover');
        this.dragTargetElement = undefined;
      }
    }, 100);
  }

  public display(): void {
    new Setting(this.containerEl)
      .setName('Add custom icon pack')
      .setDesc('Add a custom icon pack.')
      .addText((text) => {
        text.setPlaceholder('Your icon pack name');
        this.textComponent = text;
      })
      .addButton((btn) => {
        btn.setButtonText('Add icon pack');
        btn.onClick(async () => {
          const name = this.textComponent.getValue();
          if (name.length === 0) {
            return;
          }

          const normalizedName = this.normalizeIconPackName(
            this.textComponent.getValue(),
          );

          if (
            await this.plugin
              .getIconPackManager()
              .doesIconPackExist(normalizedName)
          ) {
            new Notice('Icon pack already exists.');
            return;
          }

          await this.plugin
            .getIconPackManager()
            .createCustomIconPackDirectory(normalizedName);
          this.textComponent.setValue('');
          this.refreshDisplay();
          new Notice('Icon pack successfully created.');
        });
      });

    // Sorts lucide icon pack always to the top.
    const iconPacks = [...this.plugin.getIconPackManager().getIconPacks()].sort(
      (a, b) => {
        // if (a.getName() === LUCIDE_ICON_PACK_NAME) return -1;
        // if (b.getName() === LUCIDE_ICON_PACK_NAME) return 1;
        return a.getName().localeCompare(b.getName());
      },
    );

    iconPacks.forEach((iconPack) => {
      const iconPackSetting = new Setting(this.containerEl)
        .setName(`${iconPack.getName()} (${iconPack.getPrefix()})`)
        .setDesc(`Total icons: ${iconPack.getIcons().length}`);
      iconPackSetting.addButton((btn) => {
        btn.setIcon('plus');
        btn.setTooltip('Add an icon');
        btn.onClick(async () => {
          const fileSelector = document.createElement('input');
          fileSelector.setAttribute('type', 'file');
          fileSelector.setAttribute('multiple', 'multiple');
          fileSelector.setAttribute('accept', '.svg');
          fileSelector.click();
          fileSelector.onchange = async (e) => {
            const target = e.target as HTMLInputElement;
            for (let i = 0; i < target.files.length; i++) {
              const file = target.files[i] as File;
              const content = await readFileSync(file);
              await this.plugin
                .getIconPackManager()
                .getFileManager()
                .createFile(
                  iconPack.getName(),
                  this.plugin.getIconPackManager().getPath(),
                  file.name,
                  content,
                );
              iconPack.addIcon(file.name, content);
              iconPackSetting.setDesc(
                `Total icons: ${iconPack.getIcons().length} (added: ${file.name})`,
              );
            }
            new Notice('Icons successfully added.');
          };
        });
      });
      iconPackSetting.addButton((btn) => {
        btn.setIcon('trash');
        btn.onClick(async () => {
          this.refreshDisplay();
          new Notice('Icon pack successfully deleted.');
        });
      });

      ['dragenter', 'dragover', 'dragleave', 'drop'].forEach((event) => {
        iconPackSetting.settingEl.addEventListener(
          event,
          this.preventDefaults,
          false,
        );
      });
      ['dragenter', 'dragover'].forEach((event) => {
        iconPackSetting.settingEl.addEventListener(
          event,
          () => this.highlight(iconPackSetting.settingEl),
          false,
        );
      });
      ['dragleave', 'drop'].forEach((event) => {
        iconPackSetting.settingEl.addEventListener(
          event,
          (event) =>
            this.unhighlight(
              event.currentTarget as HTMLElement,
              iconPackSetting.settingEl,
            ),
          false,
        );
      });
      iconPackSetting.settingEl.addEventListener(
        'drop',
        async (event) => {
          const files = event.dataTransfer.files;
          let successful = false;
          for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (file.type !== 'image/svg+xml') {
              new Notice(`File ${file.name} is not a SVG file.`);
              continue;
            }

            successful = true;
            const content = await readFileSync(file);
            await this.plugin
              .getIconPackManager()
              .getFileManager()
              .createFile(
                iconPack.getName(),
                this.plugin.getIconPackManager().getPath(),
                file.name,
                content,
              );
            iconPack.addIcon(file.name, content);
            iconPackSetting.setDesc(
              `Total icons: ${iconPack.getIcons().length} (added: ${file.name})`,
            );
          }

          if (successful) {
            new Notice('Icons successfully added.');
          }
        },
        false,
      );
    });
  }
}
