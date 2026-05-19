---
title: Developer API | Materialify
---

# Developer API

## Overview

Materialify provides a public API that other Obsidian plugins can use to programmatically manage icons, register custom icon packs, and more.

## Use Cases

- **Third-party Integration:** Add icon support to your own plugin.
- **Scripting:** Use Obsidian Templater or DataviewJS to change icons based on complex logic.

## Configuration

### Accessing the API

You can access the Materialify API through the global `app.plugins` object:

```typescript
const materialifyAPI = app.plugins.plugins['materialify']?.api;

if (materialifyAPI) {
  // Use the API
  materialifyAPI.setIcon(file, 'LucideHeart');
}
```

## Examples

_(Detailed API reference coming soon)_

## Notes

- The API is currently in beta and may undergo changes in future releases.

## Related Features

- [Architecture](/developer/architecture)
- [Contributing](/developer/contributing)
