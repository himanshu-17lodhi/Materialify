import type IconizePlugin from '@/main';
import { IconPack, generateIcon, getNormalizedName } from '@/engine';
import type { Icon } from '@/engine/icon-pack';
import { materialIconThemeSvgByName } from './generated';

import {
  MATERIAL_ICON_PACK_NAME,
  MATERIAL_DEFAULT_ICON_OVERRIDES,
} from './constants';

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
