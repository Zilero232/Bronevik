# Conditional render

Part of the [style guide](../README.md).

## 16. Conditional render — ts-pattern

Three or more render branches call for `match`, not nested
`if (...) return <X />` and not a chain of ternaries inside JSX.

There are two things worth matching on, and both are fine:

**A. A discriminated union.** The hook or the schema provides a union keyed on a
tag and the view only matches on it — `SearchResult`, keyed on `kind`, is one.
Reach for this when the assembly is substantial or reused:

```tsx
import { match } from 'ts-pattern';

return match(result)
  .with({ kind: 'player' }, (player) => <PaletteItem ... />)
  .with({ kind: 'tank' }, (tank) => <PaletteItem ... />)
  .with({ kind: 'clan' }, (clan) => <PaletteItem ... />)
  .with({ kind: 'map' }, (map) => <PaletteItem ... />)
  .exhaustive();
```

`.exhaustive()` turns a forgotten case into a TypeScript error the moment a
variant is added to the union.

**B. An object of raw hook results.** `match` runs straight on
`{ ...hook fields }`. Reach for this when there are only a few branches and a
separate hook layer would be ceremony — `PaletteStatus` does exactly this:

```tsx
return match({ total, isEnabled, isFetching, isError })
  .with({ isEnabled: false }, () => <p className={s.hint}>{t('hint')}</p>)
  .with({ isError: true }, () => <p className={s.error}>{t('error')}</p>)
  .with({ isFetching: true, total: 0 }, () => <Command.Loading ... />)
  .with({ total: 0 }, () => <p className={s.hint}>{t('empty')}</p>)
  .otherwise(() => null);
```

The order of `.with` matters — the first matching pattern wins. Take narrowed
values from the handler's argument, which `match` has already narrowed, never
from the closure and never through an `as` cast: a cast sidesteps the check that
makes this worth doing.

**Forbidden either way** — `if` and ternary chains that assemble JSX:

```tsx
// ✗ NOT OK — condition hell in the view
return !isEnabled ? <Hint /> : isError ? <Error /> : total === 0 ? <Empty /> : null;
```

**When to move it into a hook:** the state assembly is reused in two or more
places, or the logic is bulky enough that the view stops reading. Otherwise
option B, inline in the view, is normal.

### 16.1 One branch — use `&&`, not `? : null`

A present-or-absent render — one branch, nothing otherwise — is `cond && <X />`,
not `cond ? <X /> : null`:

```tsx
// ✗ NOT OK — a pointless : null
{label ? <span className={s.label}>{label}</span> : null}

// ✓ OK
{label && <span className={s.label}>{label}</span>}
```

Invert `cond ? null : <X />` into `!cond && <X />`.

**The condition must be a boolean.** `&&` renders its left operand as-is, so a
non-boolean falsy value (`0`, `''`, `NaN`) prints as literal garbage — a stray
`0` in the markup. Coerce numeric and string checks first:

```tsx
// ✗ DANGEROUS — renders "0" for an empty list
{players.length && <List />}

// ✓ OK — an explicit boolean check
{players.length > 0 && <List />}
{rank !== undefined && <span className={s.rank}>{rank}</span>}
{!isEmpty(players) && <List />}   // isEmpty from remeda
```
