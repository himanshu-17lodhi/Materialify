import { App, FuzzyMatch, FuzzySuggestModal } from 'obsidian';
import IconizePlugin from '@/main';
import { type Icon } from '@/engine';
import dom from '@/utils/dom';
import { saveIconToIconPack } from '@/util';
import { getSvgFromLoadedIcon, nextIdentifier } from '@/engine/util';

export default class IconsPickerModal extends FuzzySuggestModal<any> {
  private plugin: IconizePlugin;
  private path: string;

  private renderIndex = 0;

  private recentlyUsedItems: Set<string>;

  public onSelect: (iconName: string) => void | undefined;

  constructor(app: App, plugin: IconizePlugin, path: string) {
    super(app);
    this.plugin = plugin;
    this.path = path;
    this.limit = 150;

    const pluginRecentltyUsedItems = [
      ...plugin.getSettings().recentlyUsedIcons,
    ];
    this.recentlyUsedItems = new Set(
      pluginRecentltyUsedItems.reverse().filter((iconName) => {
        return this.plugin.getIconPackManager().doesIconExists(iconName);
      }),
    );

    this.resultContainerEl.classList.add('iconize-modal');
  }

  onOpen() {
    super.onOpen();
  }

  onClose() {
    const { contentEl } = this;
    contentEl.empty();
  }

  getItemText(item: Icon): string {
    return `${item.name} (${item.prefix})`;
  }

  getItems(): Icon[] {
    const iconKeys: Icon[] = [];

    if (this.inputEl.value.length === 0) {
      this.renderIndex = 0;
      this.recentlyUsedItems.forEach((iconName) => {
        const nextLetter = nextIdentifier(iconName);
        const iconPrefix = iconName.substring(0, nextLetter);
        const iconPack = this.plugin
          .getIconPackManager()
          .getIconPackByPrefix(iconPrefix);
        const iconPackName = iconPack ? iconPack.getName() : null;
        iconKeys.push({
          name: iconName.substring(nextLetter),
          prefix: iconPrefix,
          displayName: iconName,
          iconPackName: iconPackName,
          filename: '',
          svgContent: '',
          svgElement: '',
          svgViewbox: '',
        });
      });
    }

    for (const icon of this.plugin.getIconPackManager().allLoadedIconNames) {
      iconKeys.push(icon);
    }

    return iconKeys;
  }

  onChooseItem(item: Icon | string): void {
    const iconNameWithPrefix =
      typeof item === 'object'
        ? item.prefix + item.name
        : item;
    dom.createIconNode(this.plugin, this.path, iconNameWithPrefix);
    this.onSelect?.(iconNameWithPrefix);
    this.plugin.addFolderIcon(this.path, item);
    // Extracts the icon file to the icon pack.
    if (typeof item === 'object') {
      saveIconToIconPack(this.plugin, iconNameWithPrefix);
    }
    this.plugin.notifyPlugins();
  }

  renderSuggestion(item: FuzzyMatch<Icon>, el: HTMLElement): void {
    super.renderSuggestion(item, el);

    // if (getAllIconPacks().length === 0) {
    //   this.resultContainerEl.style.display = 'block';
    //   this.resultContainerEl.innerHTML = '<div class="suggestion-empty">You need to create an icon pack.</div>';
    //   return;
    // }

    // Render subheadlines for modal.
    if (this.recentlyUsedItems.size !== 0 && this.inputEl.value.length === 0) {
      if (this.renderIndex === 0) {
        const subheadline = this.resultContainerEl.createDiv();
        subheadline.classList.add('iconize-subheadline');
        subheadline.innerText = 'Recently used Icons:';
        this.resultContainerEl.prepend(subheadline);
      } else if (this.renderIndex === this.recentlyUsedItems.size - 1) {
        const subheadline = this.resultContainerEl.createDiv();
        subheadline.classList.add('iconize-subheadline');
        subheadline.innerText = 'All Icons:';
        this.resultContainerEl.append(subheadline);
      }
    }

    if (item.item.name !== 'default') {
      el.innerHTML = `<div>${
        el.innerHTML
      }</div><div class="iconize-icon-preview">${getSvgFromLoadedIcon(
        this.plugin,
        item.item.prefix,
        item.item.name,
      )}</div>`;
    }

    this.renderIndex++;
  }
}
