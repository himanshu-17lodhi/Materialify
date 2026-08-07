import type IconizePlugin from '@/main';

import { IconPack } from '@/engine/icon-pack';
import type { Icon } from '@/engine/icon-pack';

import { generateIcon, getNormalizedName } from '@/engine/util';

import { materialIconThemeSvgByName } from './generated';

import {
  MATERIAL_DEFAULT_ICON_OVERRIDES,
  MATERIAL_ICON_PACK_NAME,
} from './constants';

/**
 * Creates and populates the built-in Material icon theme pack instance.
 *
 * @param plugin Plugin instance.
 */
export const createMaterialIconPack = (plugin: IconizePlugin): IconPack => {
  const iconPack = new IconPack(plugin, MATERIAL_ICON_PACK_NAME, true);
  const icons = Object.entries(materialIconThemeSvgByName).reduce<Icon[]>(
    (result, [iconName, svgContent]) => {
      const resolvedSvgContent =
        MATERIAL_DEFAULT_ICON_OVERRIDES[iconName] ?? svgContent;
      const normalizedName = getNormalizedName(iconName);
      const icon = generateIcon(iconPack, normalizedName, resolvedSvgContent);
      if (icon) result.push(icon);
      return result;
    },
    [],
  );
  iconPack.setIcons(icons);
  return iconPack;
};
