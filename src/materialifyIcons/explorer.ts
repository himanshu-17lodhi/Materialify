import { ExplorerView, FileItem } from '@/types/obsidian';
import {
  MATERIAL_DEFAULT_ICON_IDS,
  MATERIAL_ICON_PACK_PREFIX,
} from './constants';
import { IconCache } from '@/lib/icon-cache';
import config from '@/config';
import customRule from '@/lib/customRule';
import { getFileItemTitleEl } from '@/util';
import IconizePlugin from '@/main';
import { resolveAutomaticIconName } from './resolver';
import { resolveFolderIcon } from './folderIcon';
import dom from '@/utils/dom';
import { TAbstractFile } from 'obsidian';

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
      ?.getAttribute(config.attributes.icon);
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
  const existingIcon = existingIconNode?.getAttribute(config.attributes.icon);
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
