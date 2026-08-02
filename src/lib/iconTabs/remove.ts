import { DEFAULT_FILE_DARK_ICON, DEFAULT_FILE_ICON } from '@/util';

interface RemoveOptions {
  replaceWithDefaultIcon?: boolean;
}

export default async function remove(
  iconContainer: HTMLElement,
  options?: RemoveOptions,
) {
  if (!options?.replaceWithDefaultIcon) {
    // Removes the display of the icon container to remove the icons from the tabs.
    iconContainer.style.display = 'none';
  } else {
    const isDark = document.body.classList.contains('theme-dark');
    iconContainer.innerHTML = isDark
      ? DEFAULT_FILE_DARK_ICON
      : DEFAULT_FILE_ICON;
  }
}
