import { CustomRule } from '@/settings/data';
import isApplicable from '../matching/isApplicable';
import IconizePlugin from '@/main';
import { TAbstractFile } from 'obsidian';
import { IconCache } from '@/lib/icon-cache';
import dom from '@/utils/dom';

/**
 * Tries to add the icon of the custom rule to a file or folder. This function also checks
 * if the file type matches the `for` property of the custom rule.
 * @param plugin IconizePlugin instance.
 * @param rule CustomRule that will be used to check if the rule is applicable to the file
 * or directory.
 * @param file TAbstractFile that will be used to possibly create the icon for.
 * @param container HTMLElement where the icon will be added if the custom rules matches.
 * @returns A promise that resolves to `true` if the icon was added, `false` otherwise.
 */

export default async function add(
  plugin: IconizePlugin,
  rule: CustomRule,
  file: TAbstractFile,
  container?: HTMLElement,
): Promise<boolean> {
  if (container && dom.doesElementHasIconNode(container)) {
    return false;
  }

  // Checks if the file or directory already has an icon.
  const hasIcon = plugin.getIconNameFromPath(file.path);
  if (hasIcon) {
    return false;
  }

  const doesMatch = await isApplicable(plugin, rule, file.path);
  if (doesMatch) {
    IconCache.getInstance().set(file.path, {
      iconNameWithPrefix: rule.icon,
      inCustomRule: true,
    });
    dom.createIconNode(plugin, file.path, rule.icon, {
      color: rule.color,
      container,
    });
    return true;
  }

  return false;
}
