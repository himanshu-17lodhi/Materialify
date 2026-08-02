import IconizePlugin from '@/main';
import { CustomRule } from '@/settings/data';

/**
 * Gets all the custom rules sorted by their order property in ascending order.
 */
export default function getSortedRules(plugin: IconizePlugin): CustomRule[] {
  return plugin.getSettings().rules.sort((a, b) => a.order - b.order);
}
