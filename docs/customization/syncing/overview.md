---
title: Syncing Overview | Materialify
---

# Syncing Overview

## Overview

Materialify is designed to work seamlessly with various synchronization methods, including Obsidian Sync, iCloud, and Dropbox. However, managing large icon packs requires specific configuration to avoid slowing down your sync process.

## Use Cases

- Synchronizing icon configurations across Desktop and Mobile.
- Avoiding sync conflicts with thousands of small SVG files.

## Configuration

### Recommended Setup for Obsidian Sync

To prevent Obsidian Sync from being overwhelmed by icon pack files, we recommend the following:

1. Create a folder named `icons` in your vault root (or use `.obsidian/icons`).
2. In **Materialify Settings**, set the **Icon packs folder path** to this new location.
3. **Important:** Most users should exclude this folder from Obsidian Sync to avoid "clogging" the sync queue.

### Enabling the Background Checker

The Background Checker is essential for a smooth syncing experience. It ensures that any icons referenced in your notes but missing from your local device are downloaded automatically.

![syncing-icon-packs](/public/screenshots/syncing-icon-packs.png)

## Screenshots

_(Sync settings interface coming soon)_

## Notes

- Manual icons and custom rules are stored in `data.json`, which _should_ be synced.
- Only the actual icon packs (the SVG files) are recommended for exclusion if you have thousands of them.

## Related Features

- [Background Checker](/customization/syncing/background-checker)
- [Troubleshooting](/customization/syncing/troubleshooting)
