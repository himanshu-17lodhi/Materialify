import type IconizePlugin from '@/main';
import { getNormalizedName } from '@/engine';

import {
  materialIconThemeManifest,
  materialIconThemeSvgByName,
} from './generated';

import { MATERIAL_ICON_PACK_PREFIX } from './constants';
import { stripSvgExtension } from './path';
import { resolveFolderIcon } from './folderIcon';
import {
  DEFAULT_FOLDER_DARK_ICON,
  DEFAULT_FOLDER_ICON,
  DEFAULT_FOLDER_OPEN_DARK_ICON,
  DEFAULT_FOLDER_OPEN_ICON,
} from '@/util';

const normalizeRecord = (
  record: Record<string, string>,
): Record<string, string> => {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(record)) {
    result[key.toLowerCase()] = value;
  }
  return result;
};

const getPathSuffixes = (path: string): string[] => {
  const parts = normalizeLookupKey(path).split('/').filter(Boolean);
  const suffixes: string[] = [];
  for (let i = 0; i < parts.length; i++) {
    suffixes.push(parts.slice(i).join('/'));
  }
  return suffixes;
};

const getFileExtensionCandidates = (fileName: string): string[] => {
  const parts = fileName.split('.');
  const candidates: string[] = [];
  for (let i = 1; i < parts.length; i++) {
    const extension = parts.slice(i).join('.');
    if (extension) candidates.push(extension);
  }
  return candidates;
};
const fileExtensions = normalizeRecord(
  materialIconThemeManifest.fileExtensions,
);
const fileNames = normalizeRecord(materialIconThemeManifest.fileNames);
const folderNames = normalizeRecord(materialIconThemeManifest.folderNames);
const rootFolderNames = normalizeRecord(
  materialIconThemeManifest.rootFolderNames,
);
const languageIds = normalizeRecord(materialIconThemeManifest.languageIds);

/**
 * Tries to find a resolved icon name in any of the loaded icon packs.
 */
export const toIconizeIconName = (
  plugin: IconizePlugin,
  materialIconName?: string,
): string | undefined => {
  if (!materialIconName) return undefined;

  const rawName = stripSvgExtension(materialIconName);
  const normalizedName = getNormalizedName(rawName);

  // 1. Try built-in material-icons pack
  if (materialIconThemeSvgByName[rawName]) {
    return `${MATERIAL_ICON_PACK_PREFIX}${normalizedName}`;
  }

  // 2. Search all other icon packs (case-insensitive)
  for (const iconPack of plugin.getIconPackManager().getIconPacks()) {
    const icon = iconPack.getIcons().find((i) => {
      const n = getNormalizedName(i.name).toLowerCase();
      return (
        n === normalizedName.toLowerCase() ||
        i.name.toLowerCase() === rawName.toLowerCase()
      );
    });
    if (icon) {
      return `${iconPack.getPrefix()}${getNormalizedName(icon.name)}`;
    }
  }

  return undefined;
};

export const normalizeLookupKey = (key: string): string =>
  key.toLowerCase().replace(/\\/g, '/');

export const resolveMappedFileIconName = (
  plugin: IconizePlugin,
  normalizedPath: string,
  fileName: string,
): string | undefined => {
  for (const candidate of getPathSuffixes(normalizedPath)) {
    const name = toIconizeIconName(plugin, fileNames[candidate]);
    if (name) return name;
  }

  for (const extension of getFileExtensionCandidates(fileName)) {
    /* if comment if you want to use .md icon instead of deafult */
    if (extension === 'md') continue;
    const name = toIconizeIconName(plugin, fileExtensions[extension]);
    if (name) return name;
  }

  const lastExt = fileName.split('.').pop();
  if (lastExt && languageIds[lastExt]) {
    const name = toIconizeIconName(plugin, languageIds[lastExt]);
    if (name) return name;
  }

  return undefined;
};

export const resolveInferredLanguageIconForExtension = (
  plugin: IconizePlugin,
  extension: string,
): string | undefined => {
  const normalizedExt = extension.toLowerCase();
  const inferredByLanguageId = new Map<
    string,
    { count: number; shortestMatch: number }
  >();

  for (const [mappedExt, languageId] of Object.entries(fileExtensions)) {
    if (!mappedExt.endsWith(normalizedExt)) continue;
    if (mappedExt.length > normalizedExt.length + 2) continue;
    if (!languageIds[languageId]) continue;

    const inferred = inferredByLanguageId.get(languageId);
    if (inferred) {
      inferred.count += 1;
      inferred.shortestMatch = Math.min(
        inferred.shortestMatch,
        mappedExt.length,
      );
    } else {
      inferredByLanguageId.set(languageId, {
        count: 1,
        shortestMatch: mappedExt.length,
      });
    }
  }

  const bestMatch = [...inferredByLanguageId.entries()].sort(
    ([languageA, dataA], [languageB, dataB]) => {
      if (dataA.shortestMatch !== dataB.shortestMatch) {
        return dataA.shortestMatch - dataB.shortestMatch;
      }
      if (dataA.count !== dataB.count) {
        return dataB.count - dataA.count;
      }
      return languageA.localeCompare(languageB);
    },
  )[0];

  if (!bestMatch) return undefined;
  return toIconizeIconName(plugin, bestMatch[0]);
};

export const resolveFolderIconName = (
  plugin: IconizePlugin,
  path: string,
  expanded = false,
): string | undefined => {
  const normalizedPath = normalizeLookupKey(path).replace(/\/+$/, '');
  const isRoot = !normalizedPath.includes('/');
  let icon: string | undefined;

  if (isRoot) {
    icon = toIconizeIconName(plugin, rootFolderNames[normalizedPath]);
  }

  if (!icon) {
    for (const candidate of getPathSuffixes(normalizedPath)) {
      icon = toIconizeIconName(plugin, folderNames[candidate]);
      if (icon) break;
    }
  }

  if (icon) return resolveFolderIcon(plugin, icon, expanded);

  const isDark = document.body.classList.contains('theme-dark');
  return expanded
    ? isDark
      ? DEFAULT_FOLDER_OPEN_DARK_ICON
      : DEFAULT_FOLDER_OPEN_ICON
    : isDark
      ? DEFAULT_FOLDER_DARK_ICON
      : DEFAULT_FOLDER_ICON;
};
