import type { LearningDifficulty, SweatLevel, TankStatus } from '@otmetki/schemas';

import type { BadgeTone } from '@/ui-kit';

export const SWEAT_TONE = {
  easy: 'success',
  moderate: 'steel',
  hard: 'warning',
  extreme: 'danger'
} as const satisfies Record<SweatLevel, BadgeTone>;

export const DIFFICULTY_TONE = {
  easy: 'success',
  moderate: 'steel',
  hard: 'warning',
  hardcore: 'danger'
} as const satisfies Record<LearningDifficulty, BadgeTone>;

export const STATUS_TONE = {
  researchable: 'neutral',
  premium: 'premium',
  collector: 'accent',
  reward: 'warning',
  removed: 'danger'
} as const satisfies Record<TankStatus, BadgeTone>;
