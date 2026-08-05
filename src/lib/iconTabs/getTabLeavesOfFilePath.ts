import { TabHeaderLeaf } from '@/types/obsidian';
import IconizePlugin from '@/main';
import { getAllOpenedFiles } from '@/util';

export default function getTabLeavesOfFilePath(
  plugin: IconizePlugin,
  path: string,
): TabHeaderLeaf[] {
  const openedFiles = getAllOpenedFiles(plugin);

  const openedFile = openedFiles.filter(
    (openedFile) => openedFile.path === path,
  );

  const leaves = openedFile.map((openedFile) => openedFile.leaf);

  return leaves as TabHeaderLeaf[];
}
