import type { MarkCount } from '@otmetki/icons';

import { Mark1Icon, Mark2Icon, Mark3Icon } from '@otmetki/icons';

import type { ProgressTone } from '@/ui-kit';

export const MOE_KEYS = ['p65', 'p85', 'p95', 'p100'] as const;

export const MOE_DELTA_DAYS = [7, 30] as const;

export const MOE_PLATES = [
  { key: 'p65', percent: 65, marks: 1 },
  { key: 'p85', percent: 85, marks: 2 },
  { key: 'p95', percent: 95, marks: 3 },
  { key: 'p100', percent: 100, marks: 3 }
] as const satisfies readonly { key: (typeof MOE_KEYS)[number]; percent: number; marks: MarkCount }[];

export const MARK_ICONS = { 1: Mark1Icon, 2: Mark2Icon, 3: Mark3Icon } as const;

export const MOE_SERIES_TONES = {
  p65: 'steel',
  p85: 'good',
  p95: 'accent',
  p100: 'unicum'
} as const satisfies Record<(typeof MOE_KEYS)[number], ProgressTone>;
