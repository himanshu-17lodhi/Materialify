# Testing

## Overview

Materialify uses a modern automated testing pipeline powered by Vitest.

The testing system ensures:
- feature stability
- regression prevention
- plugin reliability
- release confidence

---

## Testing Stack

Materialify currently uses:

| Tool | Purpose |
|---|---|
| Vitest | Unit testing |
| Happy DOM | DOM environment simulation |
| Istanbul | Coverage reporting |
| GitHub Actions | Continuous Integration |

---


## Running Tests

Run all tests:

```bash
pnpm test
```

Run coverage tests:
```bash
pnpm test:coverage
```

### Coverage Goals

Current minimum thresholds:

| Type  |	Threshold|
|---|---|
| Lines	| 60% |
|Functions |	60% |
|Statements	| 60% |
| Branches |	50% |


### Test Structure

Tests are colocated with source files.

Example:
```bash
src/
├── lib/
│   ├── icon.ts
│   └── icon.test.ts
```
#### Important Test Areas

Critical systems tested include:

- icon rendering
- icon packs
- custom rules
- SVG utilities
- DOM helpers
- event systems
- editor integrations

#### Coverage Exclusions

Some areas are intentionally excluded from coverage:

- generated files
- migration helpers
- runtime-only integrations
- UI rendering edge cases

#### Continuous Integration

Tests run automatically on:
- pushes
- pull requests
- release builds
via _GitHub Actions_

### Notes

Before submitting pull requests:
- run tests locally
- ensure coverage passes
- avoid breaking snapshots/utilities

#### Related Features
- Release Process
- Contributing
- Architecture
