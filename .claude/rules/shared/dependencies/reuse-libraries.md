---
paths:
  - "**/*.{ts,tsx,mts,cts,js,jsx,mjs,cjs}"
---

<!-- Compressed editing rules, loaded automatically when a TS/JS file is edited. -->
<!-- The full guide is docs/guides/ (index: docs/guides/README.md); the root CLAUDE.md carries the key rules. Keep them in sync. -->

# Dependencies — reuse before writing

## Reuse over reinvention

Before writing a helper, check whether an installed library covers it:
`@siberiacancode/reactuse` (React hooks), `remeda` (arrays/objects), `ts-pattern`
(typed branching), `date-fns`, `zod`, `motion` (animation), `p-retry`,
`@base-ui/react` (unstyled primitives), `class-variance-authority` (variant maps),
`cmdk`, visx (charts), `@tanstack/react-table` + `@tanstack/react-virtual`,
`lucide-react` + `@otmetki/icons`, `sonner`, `@otmetki/logger` (pino). Within the
monorepo: `@otmetki/ratings` for any rating math, the server's `lib/lesta` for any
Lesta call, `@otmetki/schemas` or the client's generated `z*` schemas and request types
(`shared/api/generated`) for any contract — derive from them, never retype a field.

Only libraries **already declared** in the workspace's `package.json` count. A
transitive dependency used directly is a phantom dependency — it passes locally
through hoisting and fails on a clean CI install.
