/**
 * Determines whether a given rule exists in a given path.
 * @param rule Rule to check for.
 * @param path Path to check in.
 * @returns True if the rule exists in the path, false otherwise.
 */

import { FileItem } from '@/types/obsidian';
import IconizePlugin from '@/main';
import { CustomRule } from '@/settings/data';
import isApplicable from '../matching/isApplicable';

/**
 * Gets all the file items that can be applied to the specific custom rule.
 * @param plugin Instance of IconizePlugin.
 * @param rule Custom rule that will be checked for.
 * @returns A promise that resolves to an array of file items that match the custom rule.
 */

export default async function getFileItems(
  plugin: IconizePlugin,
  rule: CustomRule,
): Promise<FileItem[]> {
  const result: FileItem[] = [];
  for (const fileExplorer of plugin.getRegisteredFileExplorers()) {
    const files = Object.values(fileExplorer.fileItems || {});
    for (const fileItem of files) {
      if (await isApplicable(plugin, rule, fileItem.file.path)) {
        result.push(fileItem);
      }
    }
  }
  return result;
}
