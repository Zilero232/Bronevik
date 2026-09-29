# Drill cleanup

Part of the [style guide](../README.md).

## 17. Drill cleanup

If the data is reachable through a global hook, the leaf fetches it itself
rather than accepting props:

```tsx
// ✗ BAD — drilling
<TopPlayers period={period} players={players} onPeriodChange={setPeriod} />

// ✓ OK — TopPlayers calls useTopPlayers() itself
const TopPlayers = () => {
  const { period, setPeriod, players } = useTopPlayers();
  // ...
};
```

**Do not parameterise a component for static content:**

```tsx
// ✗ NOT OK — the parent passes copy that never changes
<PaletteStatus emptyText={t('empty')} hintText={t('hint')} ... />

// ✓ OK — PaletteStatus reads its own copy through next-intl
<PaletteStatus isEnabled={isEnabled} isError={isError} isFetching={isFetching} total={total} />
```

**Keep props when:**

- The data comes from a `.map` (`<PlayerCard player={player} rank={index + 1} />`).
- It is the orchestrator's UI state (`open` on `MobileNav`).
- A callback needs the parent's context.
