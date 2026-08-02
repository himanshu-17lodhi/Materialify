import IconizePlugin from '@/main';
import * as refreshIcons from './refresh-icons';
import * as setFileIcon from './set-file-icon';

export function registerCommands(plugin: IconizePlugin): void {
  refreshIcons.register(plugin);
  setFileIcon.register(plugin);
}
