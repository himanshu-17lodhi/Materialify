import { getSvgFromLoadedIcon, nextIdentifier } from '@/engine';
import type IconizePlugin from '@/main';

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

/**
 * Parses an icon identifier into its normalized string, prefix, and name components.
 *
 * @param iconId Raw icon identifier.
 * @returns Object with parsed components, or undefined if invalid.
 */
export const parseIconId = (iconId: string): ParsedIconId | undefined => {
  if (!iconId || iconId.includes('<svg')) {
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

/**
 * Checks whether an icon exists in loaded packs or canonical icon definitions.
 *
 * @param plugin Plugin instance.
 * @param iconId Icon identifier to check.
 */
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
