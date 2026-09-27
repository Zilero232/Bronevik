---
paths:
  - "apps/web/client/**/*.{ts,tsx,scss}"
---

<!-- Compressed editing rules for the web client, loaded automatically on edit. -->
<!-- Full reasoning in apps/web/client/CLAUDE.md and docs/guides/client/slice-ui.md; keep them in sync. -->

# Code style — client: variants

## Variants

A primitive's variants are a `class-variance-authority` map over its module
classes in `<Name>.variants.ts` (`Button.variants.ts` → `buttonVariants`). The
styles stay in SCSS; `cva` only picks classes.
