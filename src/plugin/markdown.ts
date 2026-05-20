import SuggestionIcon from '@/editor/icons-suggestion';
import { buildIconInLinksPlugin } from '@/editor/live-preview/plugins/icon-in-links';
import { buildIconInTextPlugin } from '@/editor/live-preview/plugins/icon-in-text';
import {
  processIconInLinkMarkdown,
  processIconInTextMarkdown,
} from '@/editor/markdown-processors';
import IconizePlugin from '@/main';

export function registerMarkdownFeatures(plugin: IconizePlugin): void {
  if (plugin.getSettings().iconsInNotesEnabled) {
    /** Registering markdown post processor for icons in text and editor extension for live preview and editor */
    plugin.registerMarkdownPostProcessor((el) =>
      processIconInTextMarkdown(plugin, el),
    );
    plugin.registerEditorSuggest(new SuggestionIcon(plugin.app, plugin));
    plugin.registerEditorExtension([
      plugin.positionField,
      buildIconInTextPlugin(plugin),
    ]);
  }

  if (plugin.getSettings().iconsInLinksEnabled) {
    /** Registering markdown post processor for icons in links and editor extension for live preview and editor */
    plugin.registerMarkdownPostProcessor((el, ctx) =>
      processIconInLinkMarkdown(plugin, el, ctx),
    );
    plugin.registerEditorExtension([
      plugin.positionField,
      buildIconInLinksPlugin(plugin),
    ]);
  }
}
