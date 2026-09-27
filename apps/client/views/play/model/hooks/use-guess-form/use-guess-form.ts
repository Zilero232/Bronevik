'use client';

import type { VehicleSummary } from '@otmetki/schemas';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';

import type { GuessFormValues } from '../../../lib/guess-form';

import { GUESS_FORM_DEFAULTS } from '../../../config';
import { guessFormSchema } from '../../../lib/guess-form';
import { useGuessGame } from '../../context';

export const useGuessForm = () => {
  const { guesses, submit } = useGuessGame();
  const { control, setValue, reset, handleSubmit } = useForm<GuessFormValues>({
    resolver: zodResolver(guessFormSchema),
    defaultValues: GUESS_FORM_DEFAULTS
  });

  const pick = useWatch({ control, name: 'pick' });

  const guessedIds = guesses.map(({ subject }) => subject.vehicle.tankId);

  const setPick = (next: VehicleSummary | null) => setValue('pick', next);

  const onSubmit = handleSubmit((values) => {
    if (values.pick) {
      submit(values.pick);
      reset(GUESS_FORM_DEFAULTS);
    }
  });

  return { pick, setPick, guessedIds, attempt: guesses.length + 1, onSubmit };
};
