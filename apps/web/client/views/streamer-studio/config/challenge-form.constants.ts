import type { ChallengeFormValues } from '../model/studio.types';

export const CHALLENGE_FORM_DEFAULT_VALUES = {
  title: '',
  amount: 500,
  expiresInMinutes: 120,
  condition: { metric: 'damage', operator: 'gte', value: 3_000, battles: 1, aggregate: 'single' }
} as const satisfies ChallengeFormValues;
