import { getSvgFromLoadedIcon, nextIdentifier } from '@/engine';
import type IconizePlugin from '@/main';
import emoji from '@/emoji';

import { MATERIAL_ICON_PACK_PREFIX } from './constants';
import { materialCanonicalFolderIconNames } from './canonical-folder-icon-names';
import { stripSvgExtension } from './path';

const normalizeIconId = (iconId: string): string =>
  stripSvgExtension(iconId.trim());

interface ParsedIconId {
  normalizedId: string;
  prefix: string;
  name: string;
}

export const parseIconId = (iconId: string): ParsedIconId | undefined => {
  if (!iconId || emoji.isEmoji(iconId) || iconId.includes('<svg')) {
    return undefined;
  }

  const normalizedId = normalizeIconId(iconId);
  if (!normalizedId) {
    return undefined;
  }

  const nextLetter = nextIdentifier(normalizedId);

  return {
    normalizedId,
    prefix: normalizedId.substring(0, nextLetter),
    name: normalizedId.substring(nextLetter),
  };
};

export const iconExists = (plugin: IconizePlugin, iconId: string): boolean => {
  const parsed = parseIconId(iconId);
  if (!parsed) {
    return false;
  }

  if (
    parsed.prefix.toLowerCase() === MATERIAL_ICON_PACK_PREFIX.toLowerCase() &&
    materialCanonicalFolderIconNames.has(parsed.name)
  ) {
    return true;
  }

  return !!getSvgFromLoadedIcon(plugin, parsed.prefix, parsed.name);
};
