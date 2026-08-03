import IconizePlugin from '@/main';
import { iconExists, parseIconId } from './iconId';

const OPEN_SUFFIX = 'Open';

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
