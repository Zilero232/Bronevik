---
paths:
  - "apps/client/**/*.{ts,tsx}"
---

<!-- Compressed editing rules for the web client, loaded automatically on edit. -->
<!-- Full reasoning in apps/client/CLAUDE.md and docs/guides/shared/types.md; keep them in sync. -->

# Code style — client: table column types

## Table column types

- `global.d.ts`: never put an `import()` or an app-type reference directly inside the generic `ColumnMeta` interface. It breaks every `ColumnDef<T, never>` → `ColumnDef<T, any>` assignment. Declare a separate type alias (for example `ColumnBarMeta`) inside the same `declare module` and use inline `import()` types there. Do not add top-level imports from app code.

- DataTable columns are typed as `TableColumn<T>` from `@/ui-kit`, never as `ColumnDef<T, never>`. Converting never to any made the typecheck result depend on file order.
