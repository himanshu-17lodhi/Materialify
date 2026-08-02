const PLUGIN_NAME = 'Materialify';
const CSS_PREFIX = 'mf';

/**
 * The name of the attribute that stores the icon identifier.
 */
const ICON_ATTRIBUTE_NAME = 'data-icon';

export default {
  PLUGIN_NAME,
  CSS_PREFIX,
  classes: {
    titleIcon: `${CSS_PREFIX}-title-icon`,
    inlineTitle: `${CSS_PREFIX}-inline-title`,
  },
  attributes: {
    icon: ICON_ATTRIBUTE_NAME,
  },
};
