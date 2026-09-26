'use client';

import { challengeConditionSchema, createChallengeSchema } from '@bronevik/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';

import type { ChallengeFormOutput, ChallengeFormValues } from '../../studio.types';

import { CHALLENGE_FORM_DEFAULT_VALUES } from '../../../config';
import { useCreateChallenge } from '../use-challenges';

export const useChallengeForm = () => {
  const create = useCreateChallenge();
  const [round, setRound] = useState(0);
  const form = useForm<ChallengeFormValues, unknown, ChallengeFormOutput>({
    resolver: zodResolver(createChallengeSchema),
    defaultValues: CHALLENGE_FORM_DEFAULT_VALUES
  });

  const condition = useWatch({ control: form.control, name: 'condition' });

  const parsed = challengeConditionSchema.safeParse(condition);

  const onSubmit = form.handleSubmit((values) =>
    create.mutate(values, {
      onSuccess: () => {
        form.reset(CHALLENGE_FORM_DEFAULT_VALUES);
        setRound((value) => value + 1);
      }
    })
  );

  return {
    form,
    round,
    condition: parsed.success ? parsed.data : null,
    expiryFallback: CHALLENGE_FORM_DEFAULT_VALUES.expiresInMinutes,
    isPending: create.isPending,
    onSubmit
  };
};
