---
title: Sync Troubleshooting | Materialify
---

# Sync Troubleshooting

## Overview

If your icons are not appearing correctly on other devices, follow this guide to identify and resolve the issue.

## Use Cases

- Icons appearing as broken images or missing entirely.
- Sync process hanging or being extremely slow.
- Settings not reflecting across devices.

## Troubleshooting Steps

### 1. Check `data.json` Sync

Ensure that the file `PATH_TO_VAULT/.obsidian/plugins/materialify/data.json` is being synchronized. This file contains your icon assignments.

### 2. Verify Background Checker

Ensure the **Background Checker** is enabled on the device that is missing the icons.

### 3. Native Lucide Icons

If you are still having trouble, try switching to **Native Lucide Icons**. These are built into Obsidian and do not require external file syncing.

## Notes

- Obsidian Sync has a file limit and speed limitations for thousands of small files. This is why we recommend the Background Checker over direct syncing of the `icons/` folder.

## Related Features

- [Syncing Overview](/customization/syncing/overview)
- [Background Checker](/customization/syncing/background-checker)
