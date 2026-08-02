import emoji from '@/emoji';

import IconizePlugin, { FolderIconObject } from '@/main';

interface IconWithPath {
  path: string;
  icon: string;
}
export default function getAllWithPath(plugin: IconizePlugin): IconWithPath[] {
  const result: IconWithPath[] = [];

  Object.entries(plugin.getData()).forEach(([path, value]) => {
    if (path === 'settings' || path === 'migrated') {
      return;
    }

    const icon =
      typeof value === 'string' ? value : (value as FolderIconObject).iconName;

    if (icon && !emoji.isEmoji(icon)) {
      result.push({ path, icon });
    }
  });

  for (const rule of plugin.getSettings().rules) {
    if (!emoji.isEmoji(rule.icon)) {
      result.push({
        path: rule.rule,
        icon: rule.icon,
      });
    }
  }

  return result;
}
