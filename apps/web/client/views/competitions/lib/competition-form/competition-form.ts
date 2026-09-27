import type { CreateCompetitionInput } from '@otmetki/schemas';

import { zonedInputToIso } from '@/shared/lib';

import type { CompetitionFormValues } from './competition-form.types';

import { COMPETITION_FORM } from '../../config/competition-form.constants';

export const toCreateCompetitionInput = (values: CompetitionFormValues): CreateCompetitionInput => {
  const description = values.description.trim();

  return {
    title: values.title.trim(),
    ...(description === '' ? {} : { description }),
    visibility: values.visibility,
    mode: values.mode,
    battlesPerPlayer: values.battlesPerPlayer,
    ...(values.minTier === COMPETITION_FORM.anyTier ? {} : { minTier: Number(values.minTier) }),
    startsAt: zonedInputToIso({ value: values.startsAt }) ?? '',
    endsAt: zonedInputToIso({ value: values.endsAt }) ?? '',
    scoring: values.scoring
  };
};
