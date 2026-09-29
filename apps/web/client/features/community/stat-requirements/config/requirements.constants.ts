import type { CreateRecruiting } from '@/shared/api/generated';

export const REQUIREMENT_KEYS = ['minBattles', 'minWn8', 'maxWn8', 'minWinRate'] as const satisfies readonly (keyof NonNullable<
  CreateRecruiting['requirements']
>)[];

export const REQUIREMENTS_FORM = {
  maxWinRatePercent: 100,
  percentScale: 100,
  emptyValues: { minBattles: '', minWn8: '', maxWn8: '', minWinRate: '' }
} as const;
