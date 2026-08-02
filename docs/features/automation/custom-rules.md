---
title: Custom Rules | Materialify
---

# Custom Rules

## Overview

Custom Rules allow you to automate icon assignment based on file names, folder paths, or extensions. This is a powerful way to "Iconize" large vaults without manual effort.

## Use Cases

- **Default Icons:** Set a generic icon for all files or folders.
- **Extension Based:** Use a "PDF" icon for all `.pdf` files.
- **Path Based:** Apply a "Meeting" icon to everything inside the `Meetings/` folder.

## Configuration

### Adding a Custom Rule

1. Open **Materialify Settings**.
2. Go to **Custom Rules**.
3. Click **Add Rule**.
4. Enter a **Pattern** (RegEx or simple string).
5. Select an **Icon**.

### Setting a Default Icon

To set a default icon for your entire vault, use the pattern `.` (which matches everything).

![Default icon through custom rule](/public/screenshots/default-icon-through-customRules.png)

## Examples

| Pattern    | Icon           | Description                             |
| :--------- | :------------- | :-------------------------------------- |
| `\.pdf$`   | `File-text`    | Matches all PDF files.                  |
| `Daily/`   | `Calendar`     | Matches everything in the Daily folder. |
| `.*TODO.*` | `Check-square` | Matches any file with TODO in the name. |

## Screenshots

_(Custom rules interface screenshot coming soon)_

## Notes

- Custom rules have a **lower priority** than manual icons.
- Rules are evaluated in order; the first match will be applied.

## Related Features

- [Frontmatter Support](/features/automation/frontmatter)
- [Performance](/customization/performance)
