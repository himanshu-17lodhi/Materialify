import { FileItem, FileWithLeaf } from './@types/obsidian';
import { getSvgFromLoadedIcon, nextIdentifier } from './engine/util';
import IconizePlugin from './main';

export const DEFAULT_FILE_ICON =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><path fill="#90a4ae"d="M9 1H3.5A1.5 1.5 0 0 0 2 2.5v11A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V6L9 1zm0 1.5L12.5 6H9V2.5zm3.5 11h-9v-11h4v4h5v7z"/></svg>';

export const DEFAULT_FOLDER_ICON =
  '<svg xmlns="http://www.w3.org/2000/svg"viewBox="0 0 24 24" width="100" height="100"> <path fill="#90a4ae" d="M10,4H4C2.89,4,2,4.89,2,6v12a2,2 0 0,0 2,2h16a2,2 0 0,0 2-2V8c0-1.11-.9-2-2-2H12L10,4Z" /></svg>';

export const DEFAULT_FOLDER_OPEN_ICON =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="128" height="128"> <path fill="#90a4ae" d="M14.483 6H4.721a1 1 0 0 0-.949.684L2 12V5h12a1 1 0 0 0-1-1H7.562a1 1 0 0 1-.64-.232l-.644-.536A1 1 0 0 0 5.638 3H2a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h11l2.403-5.606A1 1 0 0 0 14.483 6" /></svg>';

export const DEFAULT_FOLDER_DARK_ICON =
  '<svg xmlns="http://www.w3.org/2000/svg"viewBox="0 0 24 24" width="100" height="100"> <path fill="#90a4ae" d="M10,4H4C2.89,4,2,4.89,2,6v12a2,2 0 0,0 2,2h16a2,2 0 0,0 2-2V8c0-1.11-.9-2-2-2H12L10,4Z" /></svg>';

export const DEFAULT_FOLDER_OPEN_DARK_ICON =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="128" height="128"> <path fill="#90a4ae" d="M14.483 6H4.721a1 1 0 0 0-.949.684L2 12V5h12a1 1 0 0 0-1-1H7.562a1 1 0 0 1-.64-.232l-.644-.536A1 1 0 0 0 5.638 3H2a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h11l2.403-5.606A1 1 0 0 0 14.483 6" /></svg>';

export const DEFAULT_FILE_DARK_ICON =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><path fill="#90a4ae"d="M9 1H3.5A1.5 1.5 0 0 0 2 2.5v11A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V6L9 1zm0 1.5L12.5 6H9V2.5zm3.5 11h-9v-11h4v4h5v7z"/></svg>';

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
