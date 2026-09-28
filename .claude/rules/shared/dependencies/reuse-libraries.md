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

## Kept on purpose

Custom code a library seems to cover but does not fit. Re-check an entry when the library changes, not when it looks duplicated:

- client `shared/lib/use-location-hash` — `useSyncExternalStore` with a `null` server snapshot, so markup keyed on the hash renders the same on the server and on the hydrating client. reactuse `useHash` reads `window.location.hash` in its `useState` initialiser (a hydration mismatch) and, in its default `replace` mode, writes the hash back on mount.
- client `shared/lib/use-hydrated`, `shared/lib/use-client-now` — the same SSR-safe `useSyncExternalStore` shape; reactuse `useMount`/`useTime` would reintroduce the mismatch.
- client `entities/streamer/overlay/lib/preview-config` base64url helpers — `Uint8Array.prototype.toBase64`/`fromBase64` are Baseline 2025 (Chrome 140, Firefox 133, Safari 18.2), above Next's default targets (Chrome/Firefox 111, Safari 16.4).
- client clock formatting (`shared/lib/duration-clock`) stays on date-fns — `Intl.DurationFormat` is missing from the `node:22` runtime image (Node 23+) and from the browsers above, and the clocks render on the server.
