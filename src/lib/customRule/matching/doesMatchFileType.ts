import { CustomRule } from '@/settings/data';
export type CustomRuleFileType = 'file' | 'folder';

/**
 * Checks if the file type is equal to the `for` property of the custom rule.
 * @param rule CustomRule that will be checked.
 * @param fileType CustomRuleFileType that will be checked. Can be either `file` or `folder`.
 * @returns Boolean whether the custom rule `for` matches the file type or not.
 */

export default function doesMatchFileType(
  rule: CustomRule,
  fileType: CustomRuleFileType,
): boolean {
  return (
    rule.for === 'everything' ||
    (rule.for === 'files' && fileType === 'file') ||
    (rule.for === 'folders' && fileType === 'folder')
  );
}
