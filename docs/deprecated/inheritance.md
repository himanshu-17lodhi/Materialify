---
title: Inheritance (Deprecated) | Materialify
---

# Inheritance (Deprecated)

<Badge type="warning" text="Deprecated since v2.10.0" />

## Overview

Inheritance was an early feature that allowed icons to be automatically applied to all files within a folder. This has been replaced by the more powerful and flexible **Custom Rules** system.

## Use Cases

- Maintaining old vaults that still rely on inheritance data.

## Configuration

### Migrating to Custom Rules

Instead of using Inheritance, we recommend creating a [Custom Rule](/features/automation/customRules) with a path pattern.

**Example:**
To mimic inheritance for a folder named `Meetings`, create a rule with the pattern `Meetings/`.

## Screenshots

![Inheritance function](/public/screenshots/add-inheritance.png)

## Notes

- Inheritance will be fully removed in a future major version of Materialify. Please migrate your data to Custom Rules.

## Related Features

- [Custom Rules](/features/automation/customRules)
- [File & Folder Icons](/features/files-and-folders/naming)
