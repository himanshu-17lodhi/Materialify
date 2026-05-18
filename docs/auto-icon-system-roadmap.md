# Automatic Icon System Roadmap

## Architecture Overview

The system introduces automatic Material Icon Theme assignments into Obsidian Iconize. It relies on a generated mapping derived from the VS Code Material Icon Theme extension.

1. **Generator Script**: `scripts/generate-material-icon-theme.mjs` extracts mappings and bundles SVGs from the VS Code extension into `src/material-icon-theme/generated.ts`.
2. **Resolver System**: `src/material-icon-theme/index.ts` provides path-to-icon resolution mapping against exact filenames, extensions, folder names, and root folders.
3. **Runtime Integration**: Intercepts Obsidian vault events (`create`, `rename`, `delete`) and Explorer `layout-ready`/refresh states to inject automatic icons without mutating the core settings icon data.
4. **Fallback Strategy**: Automatic icons only apply if no manual icon or custom rule applies to a given path.

## Migration & Mapping Strategy

- Reused the original SVGs directly and embedded them into a generated file, preserving their names.
- Leveraged `toIconizeIconName` which normalizes icon IDs into `Mi` + CamelCase names (e.g. `folder-src` -> `MiFolderSrc`).
- No manual name conversion layers were built since the `getNormalizedName` lookup inherently supports mapping `MiFolderSrc` back to `folder-src.svg` data.

## Runtime Flow

1. User changes the file/folder or Obsidian refreshes the Explorer.
2. `IconizePlugin` calls `applyAutomaticIconsToExplorer`.
3. For each file/folder, the path is passed to `resolveAutomaticIconName`.
4. Extracted filename and extensions are matched against `fileNames` and `fileExtensions`. Folders matched against `rootFolderNames` and `folderNames`.
5. Resolved icon name is stored in `IconCache` with an `automatic: true` flag.
6. DOM nodes are updated with the corresponding built-in Material icon SVG.

## Resolver Priority System

1. **Manual Icon** (stored in settings) - **HIGHEST**
2. **Custom Rule** (regex/string match) - **HIGH**
3. **Material Root Folder Match** - Medium
4. **Material Folder Match** - Medium
5. **Material Exact Filename Match** - Low
6. **Material File Extension Match** - Low
7. **Material Default File/Folder Icon** - **LOWEST**

## Cache Strategy

- Automatic icons are registered in the existing `IconCache` singleton.
- Cache invalidation occurs on file `delete` and `rename` operations.
- The cache indicates `automatic: true` to prevent automatic icons from being serialized into the plugin settings file (`data.json`).

## Event Integration Plan

- Vault `create`: Queue a path refresh for automatic icons.
- Vault `rename`: Invalidate old path cache, queue refresh for new path.
- Vault `delete`: Invalidate path cache.
- Plugin Load: Register a Material Icon pack, apply to loaded file explorers.
- Settings Update: Trigger full explorer refresh when automatic mode toggled.

## Settings Integration

- **TODO**: Introduce an `automaticMaterialIconTheme` boolean inside the settings UI.
- Provide a clear UI option under "General" or "Icon packs" to toggle the default Material auto-assignment system.

## Performance Considerations

- Lookups against JS object properties (e.g., `fileNames['package.json']`) are O(1).
- Applying icons is queued/debounced (`queueAutomaticIconRefresh`) to handle bulk operations (e.g., mass creations or git checkouts) without blocking the UI thread.
- SVGs are pre-loaded in memory via the `generated.ts` bundle.

## Edge Cases

- **.svg Mismatches**: Addressed by relying on `getNormalizedName` directly mirroring how manual icons look up existing files.
- **Large Vaults**: Debounced refresh queue ensures we don't stall the Obsidian startup.
- **Nested Files in Rules**: Handled via `.split('/')` string array suffix combinations for folders.

## Compatibility Strategy

- Works smoothly with existing Custom Rules since Custom Rules are evaluated first and `applyAutomaticIconToFileItem` simply returns if a manual/custom icon exists.

## Implementation Phases

- **Phase 1**: Analysis & Requirements Gathering _(Completed)_
- **Phase 2**: Generate Mappings & Runtime Injection Logic _(Completed)_
- **Phase 3**: Event Integration (Vault hooks & Explorer updates) _(Completed)_
- **Phase 4**: Settings Integration (UI toggle & Persistence) _(Pending)_
- **Phase 5**: Testing & Final Review _(Pending)_

## Testing Plan

- Verify runtime behavior on file creation, deletion, and renaming.
- Verify toggle setting dynamically applies/removes icons from the file tree.
- Verify custom rules continue to override automatic icons.
- Verify large folder structures resolve icons correctly.
