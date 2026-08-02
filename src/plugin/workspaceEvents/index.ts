import IconizePlugin from '@/main';

import * as activeLeafChange from './activeLeafChange';
import * as cssChange from './cssChange';
import * as fileOpen from './fileOpen';
import * as layoutChange from './layoutChange';

export function registerWorkspaceEvents(plugin: IconizePlugin): void {
  layoutChange.register(plugin);
  cssChange.register(plugin);
  activeLeafChange.register(plugin);
  fileOpen.register(plugin);
}
