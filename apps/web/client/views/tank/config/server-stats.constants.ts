const COMPACT = { notation: 'compact', maximumFractionDigits: 1 } as const satisfies Intl.NumberFormatOptions;

export const SERVER_FIGURES = [
  { key: 'winRate', unit: 'percent', format: { maximumFractionDigits: 2 } },
  { key: 'avgDamage', unit: 'none', format: { maximumFractionDigits: 0 } },
  { key: 'battles', unit: 'none', format: COMPACT },
  { key: 'players', unit: 'none', format: COMPACT },
  { key: 'winRateDiff', unit: 'pp', format: { maximumFractionDigits: 2, signDisplay: 'exceptZero' } }
] as const satisfies readonly { key: string; unit: 'none' | 'percent' | 'pp'; format: Intl.NumberFormatOptions }[];
