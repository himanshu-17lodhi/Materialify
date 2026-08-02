---
title: Frontmatter Support | Materialify
---

# Frontmatter Support

## Overview

Materialify can read icon configurations directly from your note's YAML frontmatter. This allows you to store icon data within the file itself, making it portable and easy to manage via other plugins (like Dataview or MetaEdit).

## Use Cases

- **Template Integration:** Include an icon in your note templates.
- **Programmatic Control:** Change icons using scripts or metadata-focused plugins.
- **Portability:** Keep your icon metadata inside the Markdown file.

## Configuration

### Enabling Frontmatter Support

1. Open **Materialify Settings**.
2. Navigate to **Automation**.
3. Toggle **Use frontmatter property**.

![Enable frontmatter option](/public/screenshots/enable-frontmatter-option.png)

### Using the `icon` Property

Add an `icon` property to your YAML frontmatter with the name of the icon you want to use.

```markdown
---
icon: LucideBell
---
```

## Examples

```markdown
---
title: My Task
status: open
icon: check-circle
---
```

## Screenshots

_(Frontmatter example in editor coming soon)_

## Notes

- Frontmatter icons override Custom Rules but are overridden by **Manual Icons**.
- If you use an icon pack prefix (like `Lucide...`), ensure it matches the installed pack's naming convention.

## Related Features

- [Custom Rules](/features/automation/customRules)
- [Metadatamenu Integration](/integrations/metadatamenu)
