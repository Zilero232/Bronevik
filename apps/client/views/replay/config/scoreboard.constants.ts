export const REPLAY_SCOREBOARD = {
  numeric: { align: 'end', isNumeric: true },
  stats: [
    { key: 'damageDealt', label: 'damage', meta: { bar: { tone: 'accent' } } },
    { key: 'damageAssisted', label: 'assist', meta: { hideBelow: 'md' } },
    { key: 'damageBlocked', label: 'blocked', meta: { hideBelow: 'lg' } },
    { key: 'frags', label: 'frags', meta: {} },
    { key: 'spotted', label: 'spotted', meta: { hideBelow: 'lg' } }
  ]
} as const;
