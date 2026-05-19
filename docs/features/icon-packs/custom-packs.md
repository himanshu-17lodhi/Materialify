---
title: Custom Icon Packs | Materialify
---

# Custom Icon Packs

## Overview

Materialify allows you to create your own icon packs by importing your own `.svg` files. This is perfect for personal branding or specialized workflows.

## Use Cases

- Using company logos or branding.
- Creating a unique set of icons for a specific hobby or project.
- Organizing personal SVG collections.

## Configuration

### Creating a Custom Pack

1. Go to **Materialify Settings**.
2. Click **Add icon pack**.
3. Enter a name for your pack.
4. Use the **Plus (+)** icon next to the new pack name to add your `.svg` files.

### Manual ZIP Method (Legacy/Advanced)

If you have a large number of icons, you can manage them via the file system:

1. Create a folder with your pack name in `.obsidian/plugins/materialify/icons/`.
2. Add your `.svg` files to this folder.
3. Zip the folder (the `.zip` filename must match the folder name).
4. Materialify will detect the pack upon restart.

## Examples

- **Pack Name:** `My-Logos`
- **Icon:** `Company-A.svg`

## Screenshots

![Add custom icon pack](/public/screenshots/add-custom-icon-pack.png)

## Notes

- **Stability:** Custom icon pack management is currently in active development. Please back up your icons regularly.
- **SVG Only:** Only `.svg` files are supported. For PNGs, see the [PNG to SVG](/reference/png-to-svg) guide.

## Related Features

- [Icon Packs Overview](/features/icon-packs/overview)
- [PNG to SVG](/reference/png-to-svg)
