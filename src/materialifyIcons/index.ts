import type { TAbstractFile } from 'obsidian';
import type IconizePlugin from '@/main';
import { getNormalizedName } from '@/engine/util';
import emoji from '@/emoji';
import { getSvgFromLoadedIcon, nextIdentifier } from '@/engine/util';
import {
  DEFAULT_FILE_DARK_ICON,
  DEFAULT_FILE_ICON,
  DEFAULT_FOLDER_DARK_ICON,
  DEFAULT_FOLDER_ICON,
  DEFAULT_FOLDER_OPEN_DARK_ICON,
  DEFAULT_FOLDER_OPEN_ICON,
} from '@/util';
import {
  materialIconThemeManifest,
  materialIconThemeSvgByName,
} from './generated';
import { materialCanonicalFolderIconNames } from './canonical-folder-icon-names';
import { MATERIAL_ICON_PACK_PREFIX } from './constants';

export { createMaterialIconPack } from './pack';
export { MATERIAL_ICON_PACK_NAME } from './constants';
export {
  applyAutomaticIconToFileItem,
  applyAutomaticIconsToExplorer,
  refreshPath,
} from './explorer';

const OPEN_SUFFIX = 'Open';

const normalizeLookupKey = (key: string): string =>
  key.toLowerCase().replace(/\\/g, '/');

const normalizeRecord = (
  record: Record<string, string>,
): Record<string, string> => {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(record)) {
    result[key.toLowerCase()] = value;
  }
  return result;
};

const stripSvgExtension = (name: string): string =>
  name.endsWith('.svg') ? name.substring(0, name.length - 4) : name;

const fileExtensions = normalizeRecord(
  materialIconThemeManifest.fileExtensions,
);
const fileNames = normalizeRecord(materialIconThemeManifest.fileNames);
const folderNames = normalizeRecord(materialIconThemeManifest.folderNames);
const rootFolderNames = normalizeRecord(
  materialIconThemeManifest.rootFolderNames,
);
const languageIds = normalizeRecord(materialIconThemeManifest.languageIds);

const isFolder = (file: TAbstractFile): boolean => 'children' in file;

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

const resolveMappedFileIconName = (
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

const resolveInferredLanguageIconForExtension = (
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

/**
 * Tries to find a resolved icon name in any of the loaded icon packs.
 */
const toIconizeIconName = (
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

/**
 * Normalizes an icon ID.
 */
const normalizeIconId = (iconId: string): string =>
  stripSvgExtension(iconId.trim());

interface ParsedIconId {
  normalizedId: string;
  prefix: string;
  name: string;
}

const parseIconId = (iconId: string): ParsedIconId | undefined => {
  if (!iconId || emoji.isEmoji(iconId) || iconId.includes('<svg'))
    return undefined;
  const normalizedId = normalizeIconId(iconId);
  if (!normalizedId) return undefined;
  const nextLetter = nextIdentifier(normalizedId);
  return {
    normalizedId,
    prefix: normalizedId.substring(0, nextLetter),
    name: normalizedId.substring(nextLetter),
  };
};

/**
 * Checks if an icon exists.
 */
const iconExists = (plugin: IconizePlugin, iconId: string): boolean => {
  const parsed = parseIconId(iconId);
  if (!parsed) return false;

  if (
    parsed.prefix.toLowerCase() === MATERIAL_ICON_PACK_PREFIX.toLowerCase() &&
    materialCanonicalFolderIconNames.has(parsed.name)
  ) {
    return true;
  }

  return !!getSvgFromLoadedIcon(plugin, parsed.prefix, parsed.name);
};

/**
 * Resolves the folder icon based on the open/closed state.
 */
export const resolveFolderIcon = (
  plugin: IconizePlugin,
  iconId: string,
  isOpen: boolean,
): string => {
  const parsed = parseIconId(iconId);
  if (!parsed) return iconId;

  const isAlreadyOpen = parsed.normalizedId.endsWith(OPEN_SUFFIX);
  const baseIconId = isAlreadyOpen
    ? parsed.normalizedId.substring(
        0,
        parsed.normalizedId.length - OPEN_SUFFIX.length,
      )
    : parsed.normalizedId;

  if (isOpen) {
    const openIconId = `${baseIconId}${OPEN_SUFFIX}`;
    if (iconExists(plugin, openIconId)) return openIconId;
  }
  return baseIconId;
};

export const resolveFileIconName = (
  plugin: IconizePlugin,
  path: string,
): string | undefined => {
  const normalizedPath = normalizeLookupKey(path);
  const fileName = normalizedPath.split('/').pop();
  if (!fileName) return undefined;

  if (fileName.endsWith('.md')) {
    const semanticFileName = fileName.substring(
      0,
      fileName.length - '.md'.length,
    );
    if (semanticFileName) {
      const semanticPath = `${normalizedPath.substring(0, normalizedPath.length - fileName.length)}${semanticFileName}`;
      const semanticIcon = resolveMappedFileIconName(
        plugin,
        semanticPath,
        semanticFileName,
      );
      if (semanticIcon) return semanticIcon;

      const semanticExtension = semanticFileName.split('.').pop();
      if (semanticExtension) {
        const inferredSemanticLanguageIcon =
          resolveInferredLanguageIconForExtension(plugin, semanticExtension);
        if (inferredSemanticLanguageIcon) return inferredSemanticLanguageIcon;
      }
    }
  }

  const regularIcon = resolveMappedFileIconName(
    plugin,
    normalizedPath,
    fileName,
  );
  if (regularIcon) return regularIcon;

  if (fileName.toLowerCase().endsWith('.md')) {
    const markdownIcon = toIconizeIconName(plugin, 'markdown');
    if (markdownIcon) return markdownIcon;
  }

  const isDark = document.body.classList.contains('theme-dark');
  return isDark ? DEFAULT_FILE_DARK_ICON : DEFAULT_FILE_ICON;
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

export const resolveAutomaticIconName = (
  plugin: IconizePlugin,
  path: string,
  file?: TAbstractFile,
  expanded = false,
): string | undefined => {
  if (!plugin.getSettings().automaticMaterialIconTheme) return undefined;
  const f = file ?? plugin.app?.vault?.getAbstractFileByPath?.(path);
  if (!f) return undefined;
  return isFolder(f)
    ? resolveFolderIconName(plugin, path, expanded)
    : resolveFileIconName(plugin, path);
};

export const isMaterialIconName = (name?: string | null): boolean =>
  !!name && name.startsWith(MATERIAL_ICON_PACK_PREFIX);
