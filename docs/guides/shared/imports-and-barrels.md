# Imports and barrels

Part of the [style guide](../../README.md).

## 6. Imports

### Aliases

`@/` → the `apps/web/client/` root. Used for everything except relatives inside the same slice.

The server app (`apps/web/server`) and the packages have no alias: every internal import is
relative. Inside a module relative paths reach any file; across modules, and into
`core/`, `common/`, `config/` and `lib/`, an import stops at the barrel
(`../../core`, `../../common/lib`, `../billing`), never at a file behind it. Every
segment of a server module (`services/`, `mappers/`, `selects/`, `queries/`, `lib/`,
`config/`, `providers/`, `processors/`) has an `index.ts`, so a sibling segment imports
`../mappers`, not `../mappers/goal-view/goal-view`. The one sanctioned sub-barrel across a
module boundary is `modules/collector/metrics` for `MetricsService`.

### Group order

`perfectionist/sort-imports` (`bun lint:fix`) sorts imports into groups in this order, **with a blank line between groups**:

1. **External types** — `import type` from packages, `@otmetki/*` included.
2. **External values** — packages, `node:` builtins, `@otmetki/*`.
3. **Internal types** — `import type` from `@/` aliases.
4. **Internal values** — `@/` aliases.
5. **Relative types** — `import type` from `./` and `../`.
6. **Relative values** — `./` and `../`.
7. **Styles** — `*.scss` / `*.css` imported as a module.
8. **Side effects** — `import './globals.scss'` and the like.

```ts
// 1. external types
import type { RecentPeriod } from '@otmetki/schemas';

// 2. external values
import { recentPeriodSchema } from '@otmetki/schemas';
import { useTranslations } from 'next-intl';

// 3. internal types
import type { TankStats } from '@/entities/tank/tank';

// 4. internal values
import { ratingTone } from '@/shared/lib';
import { RatingBadge } from '@/ui-kit';

// 5. relative types
import type { PlayerCardProps } from './PlayerCard.types';

// 6. relative values
import { PlayerIdentity } from './PlayerIdentity';

// 7. styles
import s from './PlayerCard.module.scss';
```

The configuration lives in the `@siberiacancode/eslint` preset the root `eslint.config.mjs` extends.
ESLint inserts the blank lines between groups on `bun lint:fix`; don't strip them by hand.

### Prohibitions

A deep import past a barrel is forbidden:

```ts
// ✗ FORBIDDEN
import { PaletteInput } from '@/features/search/command-palette/ui/components/PaletteInput';
import { Button } from '@/ui-kit/atoms/Button';

// ✓ OK
import { CommandPalette } from '@/features/search/command-palette';
import { Button } from '@/ui-kit';
```

`ui-kit` has a single root barrel, `@/ui-kit` (the atomic layer sits under it), and may itself import `@/shared/*`. Inside a slice, relative imports are fine — through the nearest barrel (`../hooks`, `./components`), with sibling hooks and components importing each other by folder (`../use-x`).

**Tests** use the `@/` alias and the public API. The only deep import a test may make is the module it mocks or spies on, since `vi.mock` must name the module actually loaded:

```ts
import { search } from '@/entities/search/search/api/search/search';

vi.mock('@/entities/search/search/api/search/search', () => ({ search: vi.fn() }));
```

ESLint does not check FSD boundaries — those are caught at review.

---

## 7. Barrel exports (`index.ts`)

**A slice:**

```ts
// entities/player/player/index.ts
export type { PlayerIdentityData, PlayerStats } from './model/player.types';
export { PlayerCard } from './ui/PlayerCard';
export type { PlayerCardProps } from './ui/PlayerCard.types';
export { PlayerIdentity } from './ui/PlayerIdentity';
export type { PlayerIdentityProps } from './ui/PlayerIdentity.types';
```

Only what is needed from outside. Internal subcomponents are not exported.

**A component folder:**

```ts
// ui/components/PaletteInput/index.ts
export { PaletteInput } from './PaletteInput';
export type { PaletteInputProps } from './PaletteInput.types';
```

**A subsystem in `model/`:** when a hook is assembled from several files in a subfolder, the `index.ts` next to them exports only the public entry point — the Provider, the hook and the types the outside needs. Internal modules do not go out.

```ts
// features/search/command-palette/model/context/index.ts
export { useCommandPalette } from './command-palette-context';
export type { CommandPaletteContextValue, CommandPaletteProviderProps } from './command-palette-context.types';
export { CommandPaletteProvider } from './CommandPaletteProvider';
```

Wildcard exports (`export * from`) are forbidden. Explicit named exports only.

**A server segment:** the segment barrel re-exports each item folder's barrel
(`mappers/index.ts` → `./leaderboard-entry`), and a module's root `index.ts` exports only
the module class and what other modules inject or call.
