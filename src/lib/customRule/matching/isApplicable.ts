import { CustomRule } from '@/settings/data';
import { Plugin } from 'obsidian';
import doesMatchFileType from './doesMatchFileType';
import doesMatchPath from './doesMatchPath';

/**
 * Determines whether a given file or folder matches a specified custom rule.
 * @param plugin Plugin instance.
 * @param rule CustomRule to check against the file or folder.
 * @param filePath String to check against the custom rule.
 * @returns Promise that resolves to `true` if the file matches the rule, `false` otherwise.
 */
export default async function isApplicable(
  plugin: Plugin,
  rule: CustomRule,
  filePath: string,
): Promise<boolean> {
  const metadata = await plugin.app.vault.adapter.stat(filePath);
  if (!metadata) {
    return false;
  }

  const fileType = metadata.type;

  const doesMatch = doesMatchFileType(rule, fileType);

  if (!doesMatch) {
    return false;
  }

  return doesMatchPath(rule, filePath);
}
