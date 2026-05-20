import IconizePlugin from '@/main';

export default async function migrate(plugin: IconizePlugin): Promise<void> {
  if (plugin.getSettings().migrated === 4) {
    if ((plugin.getSettings().emojiStyle as string) === 'none') {
      plugin.getSettings().emojiStyle = 'native';
    }
    plugin.getSettings().migrated++;
  }
}
