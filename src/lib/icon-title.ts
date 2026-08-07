import IconizePlugin from '@/main';
import config from '@/config';
import svg from '@/utils/svg';
import { IconInTitlePosition } from '@/settings/data';

const getTitleIcon = (leaf: HTMLElement): HTMLElement | null => {
  return leaf.querySelector(`.${config.CSS_PREFIX}`);
};

interface Options {
  fontSize?: number;
}

/**
 * Inserts or updates an icon element in a note's inline title header.
 *
 * @param plugin Plugin instance.
 * @param inlineTitleEl Inline title element.
 * @param svgElement SVG string of the icon.
 * @param options Styling options.
 */
const add = (
  plugin: IconizePlugin,
  inlineTitleEl: HTMLElement,
  svgElement: string,
  options?: Options,
): void => {
  if (!inlineTitleEl.parentElement) {
    return;
  }

  if (options?.fontSize) {
    svgElement = svg.setFontSize(svgElement, options.fontSize);
  }

  let titleIcon = getTitleIcon(inlineTitleEl.parentElement);
  if (!titleIcon) {
    titleIcon = document.createElement('div');
  }

  const isInline =
    plugin.getSettings().iconInTitlePosition === IconInTitlePosition.Inline;

  if (isInline) {
    titleIcon.style.display = 'inline-block';
    titleIcon.style.removeProperty('margin-inline');
    titleIcon.style.removeProperty('width');
  } else {
    titleIcon.style.display = 'block';
    titleIcon.style.width = 'var(--line-width)';
    titleIcon.style.marginInline = '0';
  }

  titleIcon.classList.add(config.CSS_PREFIX);
  titleIcon.innerHTML = svgElement;

  let wrapperElement = inlineTitleEl.parentElement;
  // Checks the parent and selects the correct wrapper element.
  // This should only happen in the beginning.
  if (
    wrapperElement &&
    !wrapperElement.classList.contains(config.classes.inlineTitle)
  ) {
    wrapperElement = wrapperElement.querySelector(
      `.${config.classes.inlineTitle}`,
    );
  }

  // Whenever there is no correct wrapper element, we create one.
  if (!wrapperElement) {
    wrapperElement = inlineTitleEl.parentElement.createDiv();
    wrapperElement.classList.add(config.classes.inlineTitle);
  }

  // Avoiding adding the same nodes together when changing the title.
  if (wrapperElement !== inlineTitleEl.parentElement) {
    inlineTitleEl.parentElement.prepend(wrapperElement);
  }

  if (isInline) {
    wrapperElement.style.display = 'flex';
    wrapperElement.style.alignItems = 'flex-start';
    const inlineTitlePaddingTop = getComputedStyle(
      inlineTitleEl,
      null,
    ).getPropertyValue('padding-top');
    titleIcon.style.paddingTop = inlineTitlePaddingTop;
    titleIcon.style.transform = 'translateY(9%)';
  } else {
    wrapperElement.style.display = 'block';
    titleIcon.style.transform = 'translateY(9%)';
  }

  wrapperElement.append(titleIcon);
  wrapperElement.append(inlineTitleEl);
};

const updateStyle = (inlineTitleEl: HTMLElement, options: Options): void => {
  if (!inlineTitleEl.parentElement) {
    return;
  }

  const titleIcon = getTitleIcon(inlineTitleEl.parentElement);
  if (!titleIcon) {
    return;
  }

  if (options.fontSize) {
    titleIcon.innerHTML = svg.setFontSize(
      titleIcon.innerHTML,
      options.fontSize,
    );
  }
};

/**
 * Hides the title icon from the provided HTMLElement.
 * @param contentEl HTMLElement to hide the title icon from.
 */
const hide = (inlineTitleEl: HTMLElement): void => {
  if (!inlineTitleEl.parentElement) {
    return;
  }

  const titleIconContainer = getTitleIcon(inlineTitleEl.parentElement);
  if (!titleIconContainer) {
    return;
  }

  titleIconContainer.style.display = 'none';
};

const remove = (inlineTitleEl: HTMLElement): void => {
  if (!inlineTitleEl.parentElement) {
    return;
  }

  const titleIconContainer = getTitleIcon(inlineTitleEl.parentElement);
  if (!titleIconContainer) {
    return;
  }

  titleIconContainer.remove();
};

export default {
  add,
  updateStyle,
  hide,
  remove,
};
