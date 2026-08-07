import config from '@/config';
import { Icon } from '@/engine';
import {
  getNormalizedName,
  getSvgFromLoadedIcon,
  nextIdentifier,
} from '@/engine/util';
import { logger } from '@/lib/logger-service';
import IconizePlugin, { FolderIconObject } from '@/main';
import dom from '@/utils/dom';

import { Notice } from 'obsidian';

export default async function checkMissingIcons(
  plugin: IconizePlugin,
  data: [string, string | FolderIconObject][],
): Promise<void> {
  const missingIcons: Set<Icon> = new Set();
  const allIcons: Map<string, boolean> = new Map();

  const getMissingIcon = async (
    iconNameWithPrefix: string,
  ): Promise<Icon | null> => {
    const iconNextIdentifier = nextIdentifier(iconNameWithPrefix);
    const iconName = iconNameWithPrefix.substring(iconNextIdentifier);
    const iconPrefix = iconNameWithPrefix.substring(0, iconNextIdentifier);

    const iconPack = plugin
      .getIconPackManager()
      .getIconPackByPrefix(iconPrefix);

    if (!iconPack) {
      return null;
    }

    const icon = iconPack.getIcon(iconName);

    if (!icon) {
      logger.error(
        `Icon file with name ${iconNameWithPrefix} could not be found`,
      );
      return null;
    }

    const doesIconFileExists = await plugin.app.vault.adapter.exists(
      `${plugin.getIconPackManager().getPath()}/${iconPack.getName()}/${iconName}.svg`,
    );

    if (!doesIconFileExists) {
      const possibleIcon = getSvgFromLoadedIcon(plugin, iconPrefix, iconName);

      if (!possibleIcon) {
        logger.error(
          `Icon SVG with name ${iconNameWithPrefix} could not be found`,
        );
        return null;
      }

      await plugin.getIconPackManager().extractIcon(icon, possibleIcon);

      return icon;
    }

    return null;
  };

  for (const rule of plugin.getSettings().rules) {
    allIcons.set(rule.icon, true);

    const icon = await getMissingIcon(rule.icon);

    if (icon) {
      missingIcons.add(icon);
    }
  }

  for (const [, value] of data) {
    let iconNameWithPrefix = value as string;

    if (typeof value === 'object') {
      iconNameWithPrefix = value.iconName;
    }

    if (iconNameWithPrefix) {
      allIcons.set(iconNameWithPrefix, true);

      const icon = await getMissingIcon(iconNameWithPrefix);

      if (icon) {
        missingIcons.add(icon);
      }
    }
  }

  if (missingIcons.size !== 0) {
    new Notice(
      `[${config.PLUGIN_NAME}] Background Check: found missing icons. Adding missing icons...`,
      10000,
    );
  }

  for (const icon of missingIcons) {
    const normalizedName = getNormalizedName(icon.prefix + icon.name);

    const nodesWithIcon = document.querySelectorAll(
      `[${config.attributes.icon}="${normalizedName}"]`,
    );

    nodesWithIcon.forEach((node: HTMLElement) => {
      dom.setIconForNode(plugin, normalizedName, node);
    });
  }

  if (missingIcons.size !== 0) {
    new Notice(
      `[${config.PLUGIN_NAME}] Background Check: added missing icons`,
      10000,
    );
  }

  for (const iconPack of plugin.getIconPackManager().getIconPacks()) {
    const doesIconPackExist = await plugin.app.vault.adapter.exists(
      `${plugin.getIconPackManager().getPath()}/${iconPack.getName()}`,
    );

    if (!doesIconPackExist) {
      continue;
    }

    const iconFiles = await plugin.app.vault.adapter.list(
      `${plugin.getIconPackManager().getPath()}/${iconPack.getName()}`,
    );

    for (const iconFilePath of iconFiles.files) {
      const iconNameWithExtension = iconFilePath.split('/').pop();

      const iconName = iconNameWithExtension?.substring(
        0,
        iconNameWithExtension.length - 4,
      );

      const iconNameWithPrefix = iconPack.getPrefix() + iconName;
      const doesIconExist = allIcons.get(iconNameWithPrefix);

      if (!doesIconExist) {
        const path = `${plugin.getIconPackManager().getPath()}/${iconPack.getName()}/${iconName}.svg`;

        const doesPathExist = await plugin.app.vault.adapter.exists(path);

        if (doesPathExist) {
          logger.info(
            `Removing icon with path '${path}' because it is not used anymore`,
          );

          await plugin.app.vault.adapter.remove(path);
        }
      }
    }
  }
}
