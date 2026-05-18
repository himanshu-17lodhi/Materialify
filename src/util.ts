import { FileItem, FileWithLeaf } from './@types/obsidian';
import { LUCIDE_ICON_PACK_NAME } from './icon-pack-manager/lucide';
import { getSvgFromLoadedIcon, nextIdentifier } from './icon-pack-manager/util';
import IconizePlugin from './main';

export const DEFAULT_FILE_ICON =
  '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M6 2H14L20 8V20C20 21.1046 19.1046 22 18 22H6C4.89543 22 4 21.1046 4 20V4C4 2.89543 4.89543 2 6 2Z" fill="#8FA1B3"/> <path d="M14 2V8H20" fill="#C7D2DB"/> <path d="M8 13H16" stroke="#E4EBF0" stroke-width="1.4" stroke-linecap="round"/> <path d="M8 16H14" stroke="#E4EBF0" stroke-width="1.4" stroke-linecap="round"/> </svg>';

export const DEFAULT_FOLDER_ICON =
  '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M3 6C3 4.89543 3.89543 4 5 4H10L12 6H19C20.1046 6 21 6.89543 21 8V18C21 19.1046 20.1046 20 19 20H5C3.89543 20 3 19.1046 3 18V6Z" fill="#7B8A97"/> <path d="M3 9H21V18C21 19.1046 20.1046 20 19 20H5C3.89543 20 3 19.1046 3 18V9Z" fill="#97A6B3"/> <path d="M3 9H21" stroke="#AFC1CF" stroke-width="1" opacity="0.5"/> </svg>';

export const DEFAULT_FOLDER_OPEN_ICON =
  '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M3 7C3 5.89543 3.89543 5 5 5H10L12 7H20C20.7403 7 21.3866 7.4022 21.7324 8H8L6 18H19C19.9624 18 20.7872 17.3141 20.962 16.3678L22.2 9.1322C22.3786 8.1658 21.6364 7.28571 20.6536 7.28571H3Z" fill="#8C9BA8"/> <path d="M6 10H22L20.8 16.4C20.6227 17.3598 19.7861 18.0579 18.81 18.0579H5.7C4.51891 18.0579 3.62794 16.9877 3.84282 15.8263L5 10Z" fill="#AFC1CF"/> <path d="M6 10H22" stroke="#D7E2EA" stroke-width="1" opacity="0.45"/> </svg>';

export const DEFAULT_FOLDER_DARK_ICON =
  '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M3 6C3 4.89543 3.89543 4 5 4H10L12 6H19C20.1046 6 21 6.89543 21 8V18C21 19.1046 20.1046 20 19 20H5C3.89543 20 3 19.1046 3 18V6Z" fill="#7B8A97"/> <path d="M3 9H21V18C21 19.1046 20.1046 20 19 20H5C3.89543 20 3 19.1046 3 18V9Z" fill="#97A6B3"/> <path d="M3 9H21" stroke="#AFC1CF" stroke-width="1" opacity="0.5"/> </svg>';

export const DEFAULT_FOLDER_OPEN_DARK_ICON =
  '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M3 7C3 5.89543 3.89543 5 5 5H10L12 7H20C20.7403 7 21.3866 7.4022 21.7324 8H8L6 18H19C19.9624 18 20.7872 17.3141 20.962 16.3678L22.2 9.1322C22.3786 8.1658 21.6364 7.28571 20.6536 7.28571H3Z" fill="#8C9BA8"/> <path d="M6 10H22L20.8 16.4C20.6227 17.3598 19.7861 18.0579 18.81 18.0579H5.7C4.51891 18.0579 3.62794 16.9877 3.84282 15.8263L5 10Z" fill="#AFC1CF"/> <path d="M6 10H22" stroke="#D7E2EA" stroke-width="1" opacity="0.45"/> </svg>';

export const DEFAULT_FILE_DARK_ICON =
  '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M6 2H14L20 8V20C20 21.1046 19.1046 22 18 22H6C4.89543 22 4 21.1046 4 20V4C4 2.89543 4.89543 2 6 2Z" fill="#8FA1B3"/> <path d="M14 2V8H20" fill="#C7D2DB"/> <path d="M8 13H16" stroke="#E4EBF0" stroke-width="1.4" stroke-linecap="round"/> <path d="M8 16H14" stroke="#E4EBF0" stroke-width="1.4" stroke-linecap="round"/> </svg>';

/**
 * Tries to read the file synchronously.
 * @param file File that will be read.
 * @returns A promise that will resolve to a string which is the content of the file.
 */
export const readFileSync = async (file: File): Promise<string> => {
  const content = await new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.readAsText(file, 'UTF-8');
    reader.onload = (readerEvent) =>
      resolve(readerEvent.target.result as string);
  });

  return content;
};

/**
 * Gets all the currently opened files by getting the markdown leaves and then checking
 * for the `file` property in the view. This also returns the leaf of the file.
 * @param plugin Instance of the IconizePlugin.
 * @returns An array of {@link FileWithLeaf} objects.
 */
export const getAllOpenedFiles = (plugin: IconizePlugin): FileWithLeaf[] => {
  return plugin.app.workspace
    .getLeavesOfType('markdown')
    .reduce<FileWithLeaf[]>((prev, curr) => {
      const file = curr.view.file;
      if (file) {
        prev.push({ ...file, leaf: curr, pinned: false });
      }
      return prev;
    }, []);
};

/**
 * Gets the file item title element by either accessing `titleEl` or `selfEl`.
 * @param fileItem FileItem which will be used to retrieve the title element from.
 * @returns HTMLElement which is the title element.
 */
export const getFileItemTitleEl = (fileItem: FileItem): HTMLElement => {
  return fileItem.titleEl ?? fileItem.selfEl;
};

/**
 * Gets the file item inner title element by either accessing `titleInnerEl` or `innerEl`.
 * @param fileItem FileItem which will be used to retrieve the inner title element from.
 * @returns HTMLElement which is the inner title element.
 */
export const getFileItemInnerTitleEl = (fileItem: FileItem): HTMLElement => {
  return fileItem.titleInnerEl ?? fileItem.innerEl;
};

/**
 * A utility function which will add the icon to the icon pack and then extract the icon
 * to the icon pack.
 * @param plugin IconizePlugin that will be used for extracting the icon.
 * @param iconNameWithPrefix String that will be used to add the icon to the icon pack.
 */
export const saveIconToIconPack = (
  plugin: IconizePlugin,
  iconNameWithPrefix: string,
): void => {
  const iconNextIdentifier = nextIdentifier(iconNameWithPrefix);
  const iconName = iconNameWithPrefix.substring(iconNextIdentifier);
  const iconPrefix = iconNameWithPrefix.substring(0, iconNextIdentifier);
  const possibleIcon = getSvgFromLoadedIcon(plugin, iconPrefix, iconName);
  if (!possibleIcon) {
    throw new Error(`Icon ${iconNameWithPrefix} could not be found.`);
  }

  const iconPack = plugin.getIconPackManager().getIconPackByPrefix(iconPrefix);
  if (
    iconPack.getName() === LUCIDE_ICON_PACK_NAME &&
    !plugin.doesUseCustomLucideIconPack()
  ) {
    return;
  }

  const icon = iconPack.getIcon(iconName);
  plugin.getIconPackManager().extractIcon(icon, possibleIcon);
};

/**
 * A utility function which will remove the icon from the icon pack by removing the icon
 * file from the icon pack directory.
 * @param plugin IconizePlugin that will be used for removing the icon.
 * @param iconNameWithPrefix String that will be used to remove the icon from the icon pack.
 */
export const removeIconFromIconPack = (
  plugin: IconizePlugin,
  iconNameWithPrefix: string,
): void => {
  const identifier = nextIdentifier(iconNameWithPrefix);
  const prefix = iconNameWithPrefix.substring(0, identifier);
  const iconName = iconNameWithPrefix.substring(identifier);
  const iconPack = plugin.getIconPackManager().getIconPackByPrefix(prefix);
  const duplicatedIcon = plugin.getDataPathByValue(iconNameWithPrefix);
  if (!duplicatedIcon) {
    iconPack.removeIcon(plugin.getIconPackManager().getPath(), iconName);
  }
};

/**
 * A utility function which will convert a string to a hexadecimal color.
 * @param str String that will be converted to a hexadecimal color.
 * @returns A string which is the hexadecimal color.
 */
export const stringToHex = (str: string): string => {
  const validHex = str.replace(/[^0-9a-fA-F]/g, '');
  const hex = validHex.padStart(6, '0').substring(0, 6);
  return `#${hex}`;
};

/**
 * A utility function which will check if a string is a hexadecimal color.
 * @param str String that will be checked if it is a hexadecimal color.
 * @param includeHash Boolean which will include the hash in the check.
 * @returns A boolean which is true if the string is a hexadecimal color.
 */
export const isHexadecimal = (str: string, includeHash = false): boolean => {
  const regex = new RegExp(`^${includeHash ? '#' : ''}[0-9A-Fa-f]{1,6}$`);
  return regex.test(str);
};
