import IconizePlugin, { FolderIconObject } from '@/main';
import * as materialIconTheme from '@/material-icon-theme';
import customRule from '../customRule';
import { IconCache } from '../icon-cache';
import dom from '@/utils/dom';

interface AddOptions {
  iconName?: string;
  iconColor?: string;
}

export default async function add(
  plugin: IconizePlugin,
  filePath: string,
  iconContainer: HTMLElement,
  options?: AddOptions,
): Promise<void> {
  const iconColor = options?.iconColor ?? plugin.getSettings().iconColor;
  const data = Object.entries(plugin.getData());

  iconContainer.style.display = 'flex';

  if (options?.iconName) {
    dom.setIconForNode(plugin, options.iconName, iconContainer, {
      color: iconColor,
    });

    iconContainer.style.margin = null;
    return;
  }

  let didAddCustomRuleIcon = false;

  for (const rule of customRule.getSortedRules(plugin)) {
    const isApplicable = await customRule.isApplicable(plugin, rule, filePath);

    if (!isApplicable) {
      continue;
    }

    dom.setIconForNode(plugin, rule.icon, iconContainer, {
      color: rule.color,
    });

    iconContainer.style.margin = null;
    didAddCustomRuleIcon = true;
    break;
  }

  const iconData = data.find(([dataPath]) => dataPath === filePath);

  if (!iconData) {
    if (didAddCustomRuleIcon) {
      return;
    }

    const automaticIconName = materialIconTheme.resolveAutomaticIconName(
      plugin,
      filePath,
    );

    if (automaticIconName) {
      IconCache.getInstance().set(filePath, {
        iconNameWithPrefix: automaticIconName,
        automatic: true,
      });

      dom.setIconForNode(plugin, automaticIconName, iconContainer, {
        color: iconColor,
      });

      iconContainer.style.margin = null;
    }

    return;
  }

  const value = iconData[1];

  if (typeof value !== 'string' && typeof value !== 'object') {
    return;
  }

  let iconName: string;

  if (typeof value === 'object') {
    const folderIcon = value as FolderIconObject;
    if (folderIcon.iconName === null) {
      return;
    }

    iconName = folderIcon.iconName;
  } else {
    iconName = value;
  }

  dom.setIconForNode(plugin, iconName, iconContainer, {
    color: iconColor,
    shouldApplyAllStyles: true,
  });

  iconContainer.style.margin = null;
}
