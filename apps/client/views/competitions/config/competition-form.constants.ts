import { COMPETITION } from '@otmetki/schemas';
import { range } from 'remeda';

import type { CompetitionFormValues } from '../lib/competition-form/competition-form.types';

export const COMPETITION_FORM = {
  anyTier: 'any',
  tiers: range(1, 12),
  descriptionRows: 4,
  weightStep: 0.05
} as const;

export const COMPETITION_FORM_DEFAULTS: CompetitionFormValues = {
  title: '',
  description: '',
  visibility: 'public',
  mode: 'random',
  battlesPerPlayer: COMPETITION.battles.default,
  minTier: COMPETITION_FORM.anyTier,
  startsAt: '',
  endsAt: '',
  scoring: { ...COMPETITION.defaultScoring }
};
