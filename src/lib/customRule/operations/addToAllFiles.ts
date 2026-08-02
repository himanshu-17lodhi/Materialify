import IconizePlugin from '@/main';
import { CustomRule } from '@/settings/data';
import { getFileItemTitleEl } from '@/util';
import getFileItems from '../queries/getFileItems';
import add from './add';

/**
 * Tries to add all specific custom rule icons to all registered files and directories.
 * It does that by calling the {@link add} function. Custom rules should have the lowest
 * priority and will get ignored if an icon already exists in the file or directory.
 * @param plugin IconizePlugin instance.
 * @param rule CustomRule that will be applied, if applicable, to all files and folders.
 */

export default async function addToAllFiles(
  plugin: IconizePlugin,
  rule: CustomRule,
): Promise<void> {
  const fileItems = await getFileItems(plugin, rule);
  for (const fileItem of fileItems) {
    await add(plugin, rule, fileItem.file, getFileItemTitleEl(fileItem));
  }
}
