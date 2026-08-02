---
title: Title Icons | Materialify
---

# Title Icons

## Overview

Display a prominent icon above your note's title, creating a Notion-like aesthetic for your Obsidian vault.

## Use Cases

- Creating "Home" or "Dashboard" pages with high visual impact.
- Quickly identifying the category of a note by looking at the top of the page.

## Configuration

### Enabling Title Icons

1. Open **Materialify Settings**.
2. Navigate to **Appearance**.
3. Toggle **Show icon above title**.

![Icon above title option](/public/screenshots/icon-above-title-option.png)

### Custom Styling

You can adjust the size and spacing of the title icon using custom CSS in your `snippets` folder.

```css
/* Adjust Materialify Title Icon size */
.materialify-title-icon {
  width: 1.5em;
  height: 1.5em;
  margin-bottom: 0.5em;
}
```

## Examples

When enabled, a note with a `Briefcase` icon will display that icon directly above the H1 title in the editor.

## Screenshots

![Icon above title](/public/screenshots/icon-above-title.png)

## Notes

- The title icon size is automatically scaled to match your theme's H1 size by default.
- This feature respects both manual icons and [Custom Rules](/features/automation/customRules).

## Related Features

- [File & Folder Icons](/features/files-and-folders/naming)
- [Appearance Settings](/customization/settings)
