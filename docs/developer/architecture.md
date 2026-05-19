---
title: Architecture | Materialify
---

# Architecture

## Overview

Materialify is designed with a modular architecture to ensure performance and maintainability. This page provides a high-level overview of how the plugin works internally.

## Key Components

1. **Icon Manager:** Handles the registration and retrieval of SVG data from icon packs.
2. **DOM Observer:** Efficiently watches for changes in the File Explorer and Tab bar to inject icons.
3. **Data Store:** Manages the `data.json` file which stores manual icon assignments and rules.
4. **API Layer:** Provides an interface for external plugins.

## Configuration

_(Technical design diagrams coming soon)_

## Notes

- We use a virtualized approach for the icon picker to handle thousands of icons without lag.
- SVG icons are cached in memory after the first load for instant re-rendering.

## Related Features

- [Developer API](/developer/api)
- [Performance](/customization/performance)
