import config from '@app/config';
import IconizePlugin from '@app/main';
// import { logger } from '@app/lib/logger';
import style from './style';
import svg from './svg';
import emoji from '@app/emoji';
import {
  getSvgFromLoadedIcon,
  nextIdentifier,
} from '@app/icon-pack-manager/util';

/**
 * Removes the `iconize-icon` icon node from the provided HTMLElement.
 * @param el HTMLElement from which the icon node will be removed.
 */
const removeIconInNode = (el: HTMLElement): void => {
  const iconNode = el.querySelector('.iconize-icon');
  if (!iconNode) {
    return;
  }

  iconNode.remove();
};

interface RemoveOptions {
  /**
   * The container that will be used to remove the icon. If not defined, it will try to
   * find the path within the `document`.
   */
  container?: HTMLElement;
}

/**
 * Removes the 'iconize-icon' icon node from the HTMLElement corresponding
 * to the specified file path.
 * @param path File path for which the icon node will be removed.
 */
const removeIconInPath = (path: string, options?: RemoveOptions): void => {
  const node =
    options?.container ?? document.querySelector(`[data-path="${path}"]`);
  if (!node) {
    return;
  }

  removeIconInNode(node);
};

interface SetIconForNodeOptions {
  color?: string;
  shouldApplyAllStyles?: boolean;
}

/**
 * Sets an icon or emoji for an HTMLElement based on the specified icon name and color.
 * The function manipulates the specified node inline.
 * @param plugin Instance of the IconizePlugin.
 * @param iconName Name of the icon or emoji to add.
 * @param node HTMLElement to which the icon or emoji will be added.
 * @param options Options for adjusting settings while the icon is being set.
 */
const setIconForNode = (
  plugin: IconizePlugin,
  iconName: string,
  node: HTMLElement,
  options?: SetIconForNodeOptions,
): void => {
  options ??= {};
  options.shouldApplyAllStyles ??= true;

  // Gets the possible icon based on the icon name.
  const iconNextIdentifier = nextIdentifier(iconName);
  const possibleIcon = getSvgFromLoadedIcon(
    plugin,
    iconName.substring(0, iconNextIdentifier),
    iconName.substring(iconNextIdentifier),
  );

  if (possibleIcon) {
    const isMaterialIcon = iconName.startsWith('Mi');
    // If it's a Material icon, we skip complex styling if requested,
    // but by default Iconize might want to apply its own margin/size.
    let iconContent =
      options?.shouldApplyAllStyles && !isMaterialIcon
        ? style.applyAll(plugin, possibleIcon, node)
        : possibleIcon;

    if (options?.color && !isMaterialIcon) {
      node.style.color = options.color;
      iconContent = svg.colorize(iconContent, options.color);
    }
    node.innerHTML = iconContent;
  } else {
    const parsedEmoji =
      emoji.parseEmoji(plugin.getSettings().emojiStyle, iconName) ?? iconName;
    node.innerHTML = options?.shouldApplyAllStyles
      ? style.applyAll(plugin, parsedEmoji, node)
      : parsedEmoji;
  }

  node.setAttribute('title', iconName);
};

interface CreateOptions {
  /**
   * The container that will be used to insert the icon. If not defined, it will try to
   * find the path within the `document`.
   */
  container?: HTMLElement;
  /**
   * The color that will be applied to the icon.
   */
  color?: string;
}

/**
 * Creates an icon node for the specified path and inserts it to the DOM.
 * @param plugin Instance of the IconizePlugin.
 * @param path Path for which the icon node will be created.
 * @param iconName Name of the icon or emoji to add.
 * @param options Optional creation options.
 */
const createIconNode = (
  plugin: IconizePlugin,
  path: string,
  iconName: string,
  options?: CreateOptions,
): void => {
  const node =
    options?.container ?? document.querySelector(`[data-path="${path}"]`);
  if (!node) {
    return;
  }

  // Find the title element where the icon should be prepended.
  const titleNode =
    node.querySelector('.nav-folder-title') ||
    node.querySelector('.nav-file-title') ||
    node;

  let iconNode: HTMLDivElement = node.querySelector('.iconize-icon');
  if (iconNode) {
    iconNode.setAttribute(config.ICON_ATTRIBUTE_NAME, iconName);
    setIconForNode(plugin, iconName, iconNode, { color: options?.color });
  } else {
    iconNode = document.createElement('div');
    iconNode.setAttribute(config.ICON_ATTRIBUTE_NAME, iconName);
    iconNode.classList.add('iconize-icon');

    setIconForNode(plugin, iconName, iconNode, { color: options?.color });

    if (titleNode.firstChild) {
      titleNode.insertBefore(iconNode, titleNode.firstChild);
    } else {
      titleNode.appendChild(iconNode);
    }
  }
};

/**
 * Checks if the element has an icon node by checking if the element has a child with the
 * class `iconize-icon`.
 * @param element HTMLElement which will be checked if it has an icon.
 * @returns Boolean whether the element has an icon node or not.
 */
const doesElementHasIconNode = (element: HTMLElement): boolean => {
  return element.querySelector('.iconize-icon') !== null;
};

/**
 * Gets the icon name of the element if it has an icon node.
 * @param element HTMLElement parent which includes a node with the icon.
 * @returns String with the icon name if the element has an icon, `undefined` otherwise.
 */
const getIconFromElement = (element: HTMLElement): string | undefined => {
  const iconNode = element.querySelector('.iconize-icon');
  const existingIcon = iconNode?.getAttribute(config.ICON_ATTRIBUTE_NAME);
  return existingIcon;
};

const getIconNodeFromPath = (path: string): HTMLElement | undefined => {
  return document
    .querySelector(`[data-path="${path}"]`)
    ?.querySelector('.iconize-icon');
};

export default {
  setIconForNode,
  createIconNode,
  doesElementHasIconNode,
  getIconFromElement,
  getIconNodeFromPath,
  removeIconInNode,
  removeIconInPath,
};
