---
title: Metadatamenu Integration | Materialify
---

# Metadatamenu Integration

## Overview

Materialify and [Metadatamenu](https://github.com/mdelobelle/metadatamenu) can work together to provide a powerful metadata-driven icon system.

## Use Cases

- Managing icons through Metadatamenu's field interface.
- Automating icon updates based on note status or category fields.

## Configuration

### Frontmatter Field Conflict

By default, Metadatamenu and Materialify may both try to manage the `icon` property. To avoid conflicts:

1. In **Materialify Settings**, change the frontmatter property name to something unique, like `materialifyIcon`.
2. Configure Metadatamenu to use this same field name for your icon selection fields.

### Suggestion List Conflict

Both plugins use similar suggestion triggers. If you find that Metadatamenu's autocomplete is interfering with Materialify's colon-syntax (`:`):

1. Change the **Icon Identifier** in Materialify settings to a different character (e.g., `::` or `!`).

## Screenshots

_(Integration configuration screenshots coming soon)_

## Notes

- Using a custom identifier allows you to have both Metadatamenu's file suggestions and Materialify's icon suggestions active simultaneously.

## Related Features

- [Frontmatter Support](/features/automation/frontmatter)
- [Inline Icons](/features/notes/inline-icons)
