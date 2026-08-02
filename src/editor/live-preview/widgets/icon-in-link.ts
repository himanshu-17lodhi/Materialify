import emoji from '@/emoji';
import { Icon } from '@/engine';
import {
  calculateFontTextSize,
  calculateHeaderSize,
  HeaderToken,
} from '@/utils/text';
import svg from '@/utils/svg';
import IconizePlugin from '@/main';
import { WidgetType } from '@codemirror/view';

export class IconInLinkWidget extends WidgetType {
  constructor(
    private plugin: IconizePlugin,
    private iconData: Icon | string,
    private path: string,
    private headerType: HeaderToken | null,
  ) {
    super();
  }

  toDOM() {
    const iconNode = document.createElement('span');
    const iconName =
      typeof this.iconData === 'string'
        ? this.iconData
        : this.iconData.prefix + this.iconData.name;
    iconNode.style.color =
      this.plugin.getIconColor(this.path) ??
      this.plugin.getSettings().iconColor;
    iconNode.setAttribute('title', iconName);
    iconNode.classList.add('iconize-icon-in-link');

    if (typeof this.iconData === 'string') {
      iconNode.style.transform = 'translateY(0)';
    }

    let innerHTML =
      typeof this.iconData === 'string'
        ? this.iconData
        : this.iconData.svgElement;

    let fontSize = calculateFontTextSize();
    if (this.headerType) {
      fontSize = calculateHeaderSize(this.headerType);
    }

    if (emoji.isEmoji(innerHTML)) {
      innerHTML = emoji.parseEmoji(
        this.plugin.getSettings().emojiStyle,
        innerHTML,
        fontSize,
      );
    } else {
      innerHTML = svg.setFontSize(innerHTML, fontSize);
    }

    iconNode.innerHTML = innerHTML;
    return iconNode;
  }

  ignoreEvent(): boolean {
    return true;
  }
}
