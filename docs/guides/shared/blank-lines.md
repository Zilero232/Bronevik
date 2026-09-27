# Blank lines

Part of the [style guide](../../README.md).

## 13. Blank lines between logical steps

`padding-line-between-statements` is configured in the root `eslint.config.mjs`
and `bun run lint:fix` applies it. Prettier only preserves blank lines and never
inserts them, which is why the ESLint rule exists at all.

**A blank line:**

- before every `return`, `throw`, `continue`, `break`;
- between the `const`/`let` setup block and the logic that acts on it;
- before and after every block — `if`, `for`, `while`, `switch`, `try`;
- before and after every **multiline** expression or declaration.

Consecutive one-line `const`/`let` declarations and consecutive one-line calls stay grouped.

```ts
// ✓
const onOpenChange = (next: boolean) => {
  setOpen(next);

  if (!next) {
    setQuery('');
  }
};
```

```ts
// ✓ several exits
if (variant === 'icon') {
  return <IconButton ... />;
}

return <button ...>...</button>;
```

Never two blank lines in a row.
