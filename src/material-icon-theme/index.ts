import type { TAbstractFile } from 'obsidian';
import type { FileItem, ExplorerView } from '@app/@types/obsidian';
import type IconizePlugin from '@app/main';
import { Icon } from '@app/icon-pack-manager';
import { IconPack } from '@app/icon-pack-manager/icon-pack';
import { generateIcon, getNormalizedName } from '@app/icon-pack-manager/util';
import customRule from '@app/lib/custom-rule';
import { IconCache } from '@app/lib/icon-cache';
import dom from '@app/lib/util/dom';
import emoji from '@app/emoji';
import {
  getSvgFromLoadedIcon,
  nextIdentifier,
} from '@app/icon-pack-manager/util';
import {
  DEFAULT_FILE_DARK_ICON,
  DEFAULT_FILE_ICON,
  DEFAULT_FOLDER_DARK_ICON,
  DEFAULT_FOLDER_ICON,
  DEFAULT_FOLDER_OPEN_DARK_ICON,
  DEFAULT_FOLDER_OPEN_ICON,
  getFileItemTitleEl,
} from '@app/util';
import config from '@app/config';
import {
  materialIconThemeManifest,
  materialIconThemeSvgByName,
} from './generated';
import { materialCanonicalFolderIconNames } from './canonical-folder-icon-names';

export const MATERIAL_ICON_PACK_NAME = 'material-icons';
const MATERIAL_ICON_PACK_PREFIX = 'Mi';
const OPEN_SUFFIX = 'Open';
const MATERIAL_DEFAULT_ICON_IDS = new Set<string>([
  'MiFile',
  'MiFolder',
  'MiFolderOpen',
  'MiFolderRoot',
  'MiFolderRootOpen',
]);

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

const MATERIAL_DEFAULT_ICON_OVERRIDES: Record<string, string> = {
  file: DEFAULT_FILE_ICON,
  folder: DEFAULT_FOLDER_ICON,
  'folder-open': DEFAULT_FOLDER_OPEN_ICON,
  'folder-root': DEFAULT_FOLDER_ICON,
  'folder-root-open': DEFAULT_FOLDER_OPEN_ICON,
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

const getFileItemPathFromElement = (
  element: HTMLElement,
): string | undefined => {
  const directPath = element.getAttribute('data-path');
  if (directPath) return directPath;

  const nearestPath = element
    .closest<HTMLElement>('[data-path]')
    ?.getAttribute('data-path');
  if (nearestPath) return nearestPath;

  return (
    element
      .querySelector<HTMLElement>(
        '.nav-folder-title[data-path], .nav-file-title[data-path]',
      )
      ?.getAttribute('data-path') ?? undefined
  );
};

const getRelevantFileItemElement = (element: HTMLElement): HTMLDivElement => {
  const nearestTitle = element.closest<HTMLElement>(
    '.nav-folder-title, .nav-file-title',
  );
  if (nearestTitle) return nearestTitle as HTMLDivElement;

  const nearestTreeItem = element.closest<HTMLElement>(
    '.nav-folder, .nav-file',
  );
  if (nearestTreeItem) return nearestTreeItem as HTMLDivElement;

  const descendantTitle = element.querySelector<HTMLElement>(
    '.nav-folder-title, .nav-file-title',
  );
  if (descendantTitle) return descendantTitle as HTMLDivElement;

  return element as HTMLDivElement;
};

const isFolderExpanded = (fileItem: FileItem): boolean => {
  const collapsed = (fileItem as { collapsed?: boolean }).collapsed;
  if (typeof collapsed === 'boolean') return !collapsed;

  const folderEl =
    (fileItem.selfEl.classList.contains('nav-folder')
      ? fileItem.selfEl
      : fileItem.selfEl.closest<HTMLElement>('.nav-folder')) ?? fileItem.selfEl;

  const ariaExpanded =
    folderEl.getAttribute('aria-expanded') ??
    fileItem.selfEl.getAttribute('aria-expanded');
  if (ariaExpanded === 'true') return true;
  if (ariaExpanded === 'false') return false;

  return !folderEl.classList.contains('is-collapsed');
};

export const applyAutomaticIconToFileItem = (
  plugin: IconizePlugin,
  fileItem: FileItem,
): boolean => {
  const path = fileItem.file.path;
  const container = getFileItemTitleEl(fileItem);
  if (!container) return false;

  const isFolderItem = 'children' in fileItem.file;
  const isExpanded = isFolderItem ? isFolderExpanded(fileItem) : false;

  // 1. Get base icon name (manual or automatic)
  let iconName = plugin.getIconNameFromPath(path);
  let isAutomatic = false;

  if (!iconName) {
    const rule = customRule
      .getSortedRules(plugin)
      .find((r) => customRule.doesMatchPath(r, path));
    if (rule) iconName = rule.icon;
  }

  if (!iconName) {
    iconName = resolveAutomaticIconName(
      plugin,
      path,
      fileItem.file,
      isExpanded,
    );
    isAutomatic = true;
  }

  if (!iconName) {
    const existing = container
      .querySelector('.iconize-icon')
      ?.getAttribute(config.ICON_ATTRIBUTE_NAME);
    if (existing?.startsWith(MATERIAL_ICON_PACK_PREFIX)) {
      dom.removeIconInNode(container);
      IconCache.getInstance().invalidate(path);
    }
    return false;
  }

  // 2. Apply dynamic open/closed state
  if (isFolderItem) {
    iconName = resolveFolderIcon(plugin, iconName, isExpanded);
  }

  // 3. Update DOM if changed
  const existingIconNode = container.querySelector(
    '.iconize-icon',
  ) as HTMLElement | null;
  const existingIcon = existingIconNode?.getAttribute(
    config.ICON_ATTRIBUTE_NAME,
  );
  if (existingIcon === iconName) {
    if (existingIconNode && MATERIAL_DEFAULT_ICON_IDS.has(iconName)) {
      dom.setIconForNode(plugin, iconName, existingIconNode);
    }
    return true;
  }

  if (isAutomatic) {
    IconCache.getInstance().set(path, {
      iconNameWithPrefix: iconName,
      automatic: true,
    });
  }
  dom.createIconNode(plugin, path, iconName, { container });
  return true;
};

export const applyAutomaticIconsToExplorer = (
  plugin: IconizePlugin,
  fileExplorer: ExplorerView,
): void => {
  if (!plugin.getSettings().automaticMaterialIconTheme) return;

  const items = Object.values(fileExplorer.fileItems || {});
  if (items.length === 0) {
    const elements = fileExplorer.containerEl.querySelectorAll('[data-path]');
    for (const el of Array.from(elements)) {
      const path = el.getAttribute('data-path');
      if (path) {
        const file = plugin.app.vault.getAbstractFileByPath(path);
        if (file)
          applyAutomaticIconToFileItem(plugin, {
            file,
            selfEl: el as HTMLDivElement,
          } as any);
      }
    }
  } else {
    for (const item of items) applyAutomaticIconToFileItem(plugin, item);
  }

  if (!(fileExplorer as any).materialIconObserver) {
    const observer = new MutationObserver((mutations) => {
      if (!plugin.getSettings().automaticMaterialIconTheme) return;

      const changedElementsByPath = new Map<string, HTMLDivElement>();

      for (const m of mutations) {
        const target = m.target as HTMLElement;
        const path = getFileItemPathFromElement(target);
        if (!path) continue;
        changedElementsByPath.set(path, getRelevantFileItemElement(target));
      }

      for (const [path, element] of changedElementsByPath) {
        const file = plugin.app.vault.getAbstractFileByPath(path);
        if (!file) continue;

        const existingFileItem = fileExplorer.fileItems?.[path];
        if (existingFileItem) {
          applyAutomaticIconToFileItem(plugin, existingFileItem);
        } else {
          applyAutomaticIconToFileItem(plugin, {
            file,
            selfEl: element,
          } as FileItem);
        }
      }
    });
    observer.observe(fileExplorer.containerEl, {
      attributes: true,
      subtree: true,
      attributeFilter: ['class'],
    });
    (fileExplorer as any).materialIconObserver = observer;
    const originalOnClose = (fileExplorer as any).onClose.bind(fileExplorer);
    (fileExplorer as any).onClose = async () => {
      observer.disconnect();
      return originalOnClose();
    };
  }
};

export const isMaterialIconName = (name?: string | null): boolean =>
  !!name && name.startsWith(MATERIAL_ICON_PACK_PREFIX);

export const refreshPath = (
  plugin: IconizePlugin,
  path: string,
  _file?: TAbstractFile,
): boolean => {
  let refreshed = false;
  for (const explorer of plugin.getRegisteredFileExplorers()) {
    const item = explorer.fileItems?.[path];
    if (item) {
      applyAutomaticIconToFileItem(plugin, item);
      refreshed = true;
    }
  }
  return refreshed;
};
