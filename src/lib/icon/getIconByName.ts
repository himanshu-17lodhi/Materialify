import { Icon } from '@/engine';
import { nextIdentifier } from '@/engine/util';
import IconizePlugin from '@/main';

export default function getIconByName(
  plugin: IconizePlugin,
  iconNameWithPrefix: string,
): Icon | null {
  const iconNextIdentifier = nextIdentifier(iconNameWithPrefix);
  const iconName = iconNameWithPrefix.substring(iconNextIdentifier);
  const iconPrefix = iconNameWithPrefix.substring(0, iconNextIdentifier);

  const iconPack = plugin.getIconPackManager().getIconPackByPrefix(iconPrefix);

  if (!iconPack) {
    return null;
  }

  const icon = iconPack.getIcon(iconName);

  if (!icon) {
    return null;
  }

  return icon;
}
