import type { TAbstractFile } from 'obsidian';
import type IconizePlugin from '@/main';

import { materialIconThemeManifest } from './generated';
import { MATERIAL_ICON_PACK_PREFIX } from './constants';

import {
  normalizeLookupKey,
  resolveFolderIconName,
  resolveMappedFileIconName,
  resolveInferredLanguageIconForExtension,
  toIconizeIconName,
} from './lookup';

const isFolder = (file: TAbstractFile): boolean => 'children' in file;

/**
 * Resolves the automatic icon name for a file based on path, name, or language extension.
 *
 * @param plugin Plugin instance.
 * @param path Vault path of the file.
 * @returns Resolved icon identifier or default file icon.
 */
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
        if (semanticExtension.toLowerCase() === 'md') {
          const markdownIcon = toIconizeIconName(plugin, 'markdown');
          if (markdownIcon) return markdownIcon;
        }

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

  const defaultFile = materialIconThemeManifest.file ?? 'file';
  return toIconizeIconName(plugin, defaultFile) ?? 'Mifile';
};

/**
 * Resolves an automatic icon name for a file or folder item.
 *
 * @param plugin Plugin instance.
 * @param path Path of the item.
 * @param file Abstract file instance if available.
 * @param expanded Whether a folder item is currently expanded.
 * @returns Resolved icon name or undefined if automatic icons are disabled.
 */
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

/**
 * Checks whether an icon name belongs to the Material icon theme pack.
 *
 * @param name Icon identifier to check.
 */
export const isMaterialIconName = (name?: string | null): boolean =>
  !!name && name.startsWith(MATERIAL_ICON_PACK_PREFIX);
