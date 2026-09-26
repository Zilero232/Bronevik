import type { CONDITION_MESSAGES } from '../../config';

export type ConditionText =
  | { kind: 'generic'; id: string }
  | { kind: 'message'; key: (typeof CONDITION_MESSAGES)[number] }
  | { kind: 'series'; goal: number; title: string | null }
  | { kind: 'text'; text: string };
