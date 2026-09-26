import { secondsInMinute } from 'date-fns/constants';

import type { RatingTone } from '@/shared/lib';

import { EFFICIENCY_TONES } from '../../config';

export const efficiencyTone = (ratio: number | null): RatingTone | null =>
  ratio === null ? null : (EFFICIENCY_TONES.find((step) => ratio >= step.from)?.tone ?? null);

export const durationClock = (seconds: number): string =>
  `${Math.floor(seconds / secondsInMinute)}:${String(Math.floor(seconds % secondsInMinute)).padStart(2, '0')}`;
