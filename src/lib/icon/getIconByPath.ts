import { Icon } from '@/engine';
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

  return getIconByName(plugin, iconNameWithPrefix);
}
