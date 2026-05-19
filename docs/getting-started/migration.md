---
title: Migration Guide | Materialify
---

# Migration Guide

## Overview

If you are coming from **Obsidian Iconize**, this guide will help you transition smoothly to **Materialify**.

## Use Cases

- Upgrading from `obsidian-iconize`.
- Resolving conflicts between old icon data and new Materialify structures.

## Configuration

### Automatic Migration

Materialify is designed to be backwards compatible with your existing `iconize` data. Upon first run:

1. Materialify will detect existing icon configurations.
2. It will migrate settings and icon associations to the new `materialify` namespace.
3. Your icons should appear exactly as they were.

### Manual Cleanup

If you encounter issues, you may need to manually update your plugin folder:

1. Ensure `obsidian-iconize` is disabled or removed.
2. Check that your `data.json` has been successfully migrated (Materialify creates a backup).

## Screenshots

_(Migration success screen coming soon)_

## Notes

- The plugin ID has changed from `obsidian-iconize` to `materialify`.
- Settings keys have been modernized; old keys are deprecated but supported for a limited time.

## Related Features

- [Installation](/getting-started/installation)
- [Architecture](/developer/architecture)
