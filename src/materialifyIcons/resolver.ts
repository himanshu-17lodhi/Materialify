import type { TAbstractFile } from 'obsidian';
import type IconizePlugin from '@/main';

import { DEFAULT_FILE_DARK_ICON, DEFAULT_FILE_ICON } from '@/util';

import { MATERIAL_ICON_PACK_PREFIX } from './constants';

import {
  normalizeLookupKey,
  resolveFolderIconName,
  resolveMappedFileIconName,
  resolveInferredLanguageIconForExtension,
  toIconizeIconName,
} from './lookup';

const isFolder = (file: TAbstractFile): boolean => 'children' in file;

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
