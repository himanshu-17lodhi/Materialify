import { CustomRule } from '@/settings/data';
/**
 * Determines whether a given rule exists in a given path.
 * @param rule Rule to check for.
 * @param path Path to check in.
 * @returns True if the rule exists in the path, false otherwise.
 */
export default function doesMatchPath(rule: CustomRule, path: string): boolean {
  const toMatch = rule.useFilePath ? path : path.split('/').pop();
  try {
    const regex = new RegExp(rule.rule);
    if (toMatch.match(regex)) {
      return true;
    }
  } catch {
    return toMatch.includes(rule.rule);
  }
  return false;
}
