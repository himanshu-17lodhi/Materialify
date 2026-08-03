export { MATERIAL_ICON_PACK_NAME } from './constants';

export {
  applyAutomaticIconToFileItem,
  applyAutomaticIconsToExplorer,
  refreshPath,
} from './explorer';

export {
  normalizeLookupKey,
  resolveFolderIconName,
  resolveInferredLanguageIconForExtension,
  resolveMappedFileIconName,
  toIconizeIconName,
} from './lookup';

export { createMaterialIconPack } from './pack';

export {
  resolveAutomaticIconName,
  resolveFileIconName,
  isMaterialIconName,
} from './resolver';

export { resolveFolderIcon } from './folderIcon';
