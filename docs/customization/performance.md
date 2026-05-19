---
title: Performance | Materialify
---

# Performance

## Overview

Materialify is built with performance in mind. We use efficient SVG rendering and smart caching to ensure that even large vaults with thousands of icons remain snappy.

## Use Cases

- Maintaining high performance in vaults with >10,000 files.
- Minimizing startup time and memory usage.

## Configuration

### Optimization Tips

- **Limit Icon Packs:** Only download the icon packs you actually use.
- **Enable Background Checker:** This helps clean up unused icon files that might be bloating your plugin folder.
- **Native Lucide Icons:** Use the built-in Lucide icons whenever possible, as they require no additional downloads or extraction.

## Screenshots

_(Performance metrics comparison coming soon)_

## Notes

- Caching is used for the icon picker search to provide instant results.
- Icons are rendered on-demand in the File Explorer to reduce initial load times.

## Related Features

- [Syncing Performance](/customization/syncing/overview)
- [Background Checker](/customization/syncing/background-checker)
