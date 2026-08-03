import {
  DEFAULT_FILE_ICON,
  DEFAULT_FOLDER_ICON,
  DEFAULT_FOLDER_OPEN_ICON,
} from '@/util';

export const MATERIAL_ICON_PACK_NAME = 'material-icons';
export const MATERIAL_DEFAULT_ICON_OVERRIDES: Record<string, string> = {
  file: DEFAULT_FILE_ICON,
  folder: DEFAULT_FOLDER_ICON,
  'folder-open': DEFAULT_FOLDER_OPEN_ICON,
  'folder-root': DEFAULT_FOLDER_ICON,
  'folder-root-open': DEFAULT_FOLDER_OPEN_ICON,
};

export const MATERIAL_ICON_PACK_PREFIX = 'Mi';
export const MATERIAL_DEFAULT_ICON_IDS = new Set<string>([
  'MiFile',
  'MiFolder',
  'MiFolderOpen',
  'MiFolderRoot',
  'MiFolderRootOpen',
]);
