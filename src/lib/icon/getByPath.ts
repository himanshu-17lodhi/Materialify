import type { FolderIconObject } from '@/main';
import IconizePlugin from '@/main';

import customRule from '@/lib/customRule';
import * as materialIconTheme from '@/material-icon-theme';

export default function getByPath(
  plugin: IconizePlugin,
  path: string,
): string | undefined {
  if (path === 'settings' || path === 'migrated') {
    return undefined;
  }

  const value = plugin.getData()[path];

  if (typeof value === 'string') {
    return value;
  }

  if (typeof value === 'object') {
    const folder = value as FolderIconObject;

    if (folder.iconName !== null) {
      return folder.iconName;
    }
  }

  const rule = customRule.getSortedRules(plugin).find((rule) => {
    return customRule.doesMatchPath(rule, path);
  });

  if (rule) {
    return rule.icon;
  }

  return materialIconTheme.resolveAutomaticIconName(plugin, path);
}
