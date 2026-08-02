import IconizePlugin from '@/main';
import { CustomRule } from '@/settings/data';
import config from '@/config';
import doesMatchFileType from '../matching/doesMatchFileType';
import doesMatchPath from '../matching/doesMatchPath';
import dom from '@/utils/dom';
import { IconCache } from '@/lib/icon-cache';

/**
 * Removes the icon from the custom rule from all the files and folders, if applicable.
 * @param plugin IconizePlugin instance.
 * @param rule CustomRule where the icons will be removed based on this rule.
 */
export default async function removeFromAllFiles(
  plugin: IconizePlugin,
  rule: CustomRule,
): Promise<void> {
  const nodesWithIcon = document.querySelectorAll(
    `[${config.attributes.icon}="${rule.icon}"]`,
  );

  for (let i = 0; i < nodesWithIcon.length; i++) {
    const node = nodesWithIcon[i];
    // Parent element is the node which contains the data path.
    const parent = node.parentElement;
    if (!parent) {
      continue;
    }

    const dataPath = parent.getAttribute('data-path');
    if (!dataPath) {
      continue;
    }

    const fileType = (await plugin.app.vault.adapter.stat(dataPath)).type;
    if (doesMatchPath(rule, dataPath) && doesMatchFileType(rule, fileType)) {
      dom.removeIconInNode(parent);
      IconCache.getInstance().invalidate(dataPath);
    }
  }
}
