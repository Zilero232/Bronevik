# Arrow functions and braces

Part of the [style guide](../README.md).

## 9. Arrow functions: the body

**ESLint decides (`arrow-body-style: as-needed`, from `@siberiacancode/eslint`).** A function whose body is a single `return` uses an expression body; anything with statements uses a block body. `bun run lint:fix` rewrites it automatically, so never fight the rule by hand.

Components are arrow functions too — `siberiacancode/function-component-definition` enforces it.

```ts
// ✓ OK — single expression
export const toneOfTier = (tier: RatingTier): RatingTone => TIER_TONE[tier];

// ✓ OK — statements, so a block
export const useCommandPalette = () => {
  const context = use(CommandPaletteContext);

  if (!context) {
    throw new Error('useCommandPalette must be used inside CommandPaletteProvider');
  }

  return context;
};

// ✗ NOT OK — ESLint error
export const toneOfTier = (tier: RatingTier): RatingTone => {
  return TIER_TONE[tier];
};
```

### 9.1 `if` / `else` — always with braces

**The body of `if`, `else if` and `else` always goes in `{}`, even for a single line.** A one-liner `if (cond) doThing();` is forbidden: adding a second statement to the branch then needs no structural rewrite, diffs stay cleaner, and there is no "forgot the braces" trap. Enforced by ESLint (`curly: ['error', 'all']` in the root config) — `bun lint:fix` fixes it automatically.

```ts
// ✓ OK
if (!hasLocale(routing.locales, locale)) {
  notFound();
}

if (event.key !== '/' || isTyping(event.target)) {
  return;
}

// ✗ NOT OK
if (!hasLocale(routing.locales, locale)) notFound();
if (event.key !== '/' || isTyping(event.target)) return;
```

A ternary that returns a value is still fine (it is an expression, not a statement): `return a ? b : c;`.
