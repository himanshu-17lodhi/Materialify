import { FileItem, FileWithLeaf } from './@types/obsidian';
import { LUCIDE_ICON_PACK_NAME } from './icon-pack-manager/lucide';
import { getSvgFromLoadedIcon, nextIdentifier } from './icon-pack-manager/util';
import IconizePlugin from './main';

// Default VS Code explorer file icon.
export const DEFAULT_FILE_ICON =
  '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M10.5702 1.14L13.8502 4.44L14.0002 4.8V14.5L13.5002 15H2.50024L2.00024 14.5V1.5L2.50024 1H10.2202L10.5702 1.14ZM10.0002 5H13.0002L10.0002 2V5ZM3.00024 2V14H13.0002V6H9.50024L9.00024 5.5V2H3.00024ZM11.0002 7H5.00024V8H11.0002V7ZM5.00024 9H11.0002V10H5.00024V9ZM11.0002 11H5.00024V12H11.0002V11Z" fill="#424242"/></svg>';

// Default VS Code explorer folder icon.
export const DEFAULT_FOLDER_ICON =
  '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14.5002 3H7.71021L6.86023 2.15002L6.51025 2H1.51025L1.01025 2.5V6.5V13.5L1.51025 14H14.5103L15.0103 13.5V9V3.5L14.5002 3ZM13.9902 11.49V13H1.99023V11.49V7.48999V7H6.48022L6.8302 6.84998L7.69019 5.98999H14.0002V7.48999L13.9902 11.49ZM13.9902 5H7.49023L7.14026 5.15002L6.28027 6.01001H2.00024V3.01001H6.29028L7.14026 3.85999L7.50024 4.01001H14.0002L13.9902 5Z" fill="#424242"/></svg>';

export const DEFAULT_FOLDER_OPEN_ICON =
  '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.50024 14H12.5002L12.9802 13.63L15.6102 6.63L15.1302 6H14.0002V3.5L13.5002 3H7.71021L6.85022 2.15002L6.50024 2H1.50024L1.00024 2.5V13.5L1.50024 14ZM2.00024 3H6.29028L7.15027 3.84998L7.50024 4H13.0002V6H8.50024L8.15027 6.15002L7.29028 7H3.50024L3.03027 7.33997L2.03027 10.42L2.00024 3ZM12.1302 13H2.19019L3.86023 8H7.50024L7.85022 7.84998L8.71021 7H14.5002L12.1302 13Z" fill="#424242"/></svg>';

export const DEFAULT_FOLDER_DARK_ICON =
  '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14.5 3H7.70996L6.85999 2.15002L6.51001 2H1.51001L1.01001 2.5V6.5V13.5L1.51001 14H14.51L15.01 13.5V9V3.5L14.5 3ZM13.99 11.49V13H1.98999V11.49V7.48999V7H6.47998L6.82996 6.84998L7.68994 5.98999H14V7.48999L13.99 11.49ZM13.99 5H7.48999L7.14001 5.15002L6.28003 6.01001H2V3.01001H6.29004L7.14001 3.85999L7.5 4.01001H14L13.99 5Z" fill="#C5C5C5"/></svg>';

export const DEFAULT_FOLDER_OPEN_DARK_ICON =
  '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.5 14H12.5L12.98 13.63L15.61 6.63L15.13 6H14V3.5L13.5 3H7.70996L6.84998 2.15002L6.5 2H1.5L1 2.5V13.5L1.5 14ZM2 3H6.29004L7.15002 3.84998L7.5 4H13V6H8.5L8.15002 6.15002L7.29004 7H3.5L3.03003 7.33997L2.03003 10.42L2 3ZM12.13 13H2.18994L3.85999 8H7.5L7.84998 7.84998L8.70996 7H14.5L12.13 13Z" fill="#C5C5C5"/></svg>';

// Default VS Code explorer file icon for dark theme.
export const DEFAULT_FILE_DARK_ICON =
  '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M10.57 1.14L13.85 4.44L14 4.8V14.5L13.5 15H2.5L2 14.5V1.5L2.5 1H10.22L10.57 1.14ZM10 5H13L10 2V5ZM3 2V14H13V6H9.5L9 5.5V2H3ZM11 7H5V8H11V7ZM5 9H11V10H5V9ZM11 11H5V12H11V11Z" fill="#C5C5C5"/></svg>';

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
