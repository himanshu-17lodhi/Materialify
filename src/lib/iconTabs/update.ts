import IconizePlugin from '@/main';
import dom from '@/utils/dom';

export default async function update(
  plugin: IconizePlugin,
  iconName: string,
  iconContainer: HTMLElement,
) {
  dom.setIconForNode(plugin, iconName, iconContainer);
  // TODO: Refactor to include option to `insertIconToNode` function.
  iconContainer.style.margin = null;
}
