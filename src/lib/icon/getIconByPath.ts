import { Icon } from '@/engine';
import emoji from '@/emoji';
import IconizePlugin from '@/main';

import getByPath from './getByPath';
import getIconByName from './getIconByName';

export default function getIconByPath(
  plugin: IconizePlugin,
  path: string,
): Icon | string | null {
  const iconNameWithPrefix = getByPath(plugin, path);

  if (!iconNameWithPrefix) {
    return null;
  }

  if (emoji.isEmoji(iconNameWithPrefix)) {
    return iconNameWithPrefix;
  }

  return getIconByName(plugin, iconNameWithPrefix);
}
