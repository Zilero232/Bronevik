# Forbidden

Part of the [style guide](../README.md).

## 19. Forbidden

- `any` — use `unknown`. `ts/consistent-type-assertions` also warns on casts;
  a cast that survives review needs a reason.
- A non-null assertion `!` with no justification.
- Deep imports past a barrel.
- Cross-imports between slices of the same layer.
- CSS-in-JS. SCSS modules only (`cva` maps module classes, it does not style).
- Duplicating a schema between client and server. A shared contract lives only in
  `@otmetki/schemas`; a server-only request schema lives in the module's `dto/`.
- `useState` for form fields. Only `react-hook-form`, inside a `use-<x>-form` hook.
- Logic in a component: queries, effects, memoised or derived data, handlers with more
  than one statement. They go to `model/hooks/use-<x>/`.
- `<Name>.helpers.ts`, `<Name>.utils.ts`, `<Name>.constants.ts` or `hooks/` inside a
  component folder ([§2](../client/slice-ui.md)). Helpers → `lib/<concern>/`, constants → `config/`.
- Two flat components in one `ui/` root, or two components in one file.
- Mock data layers or fixture fallbacks in app code ([§11](../client/segments.md)).
- Prisma migrations before production. The schema is synced with `bun run db:push`
  (`prisma db push` + the Timescale layer); no `prisma migrate` until the first release.
- Nested `if (...) return <X />` across three or more branches. Use
  `ts-pattern`'s `match`.
- Prop-drilling when the leaf can call the hook itself.
- Comments. The code is expected to read on its own; the reasoning belongs in
  CLAUDE.md or the commit message. An `eslint-disable-next-line` carries its reason
  after `--`.
- A user-visible string that does not go through i18n — and it goes into both
  `locales/ru/<namespace>.json` and `locales/en/<namespace>.json`, never one of them.
- `Link`, `useRouter` or `usePathname` from `next/*` — use `@/shared/i18n/navigation`.
