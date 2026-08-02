import IconizePlugin from '@/main';
import * as refreshIcons from './refreshIcons';
import * as setFileIcon from './setFileIcon';

export function registerCommands(plugin: IconizePlugin): void {
  refreshIcons.register(plugin);
  setFileIcon.register(plugin);
}
