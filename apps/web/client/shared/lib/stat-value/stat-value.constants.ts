export const STAT_VALUE = {
  empty: '—',
  formats: {
    count: { maximumFractionDigits: 0 },
    decimal: { minimumFractionDigits: 2, maximumFractionDigits: 2 },
    percent: { style: 'percent', minimumFractionDigits: 2, maximumFractionDigits: 2 }
  }
} as const satisfies { empty: string; formats: Record<string, Intl.NumberFormatOptions> };
