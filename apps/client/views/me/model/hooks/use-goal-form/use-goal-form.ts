'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { getLinkedAccounts } from '@/entities/auth/session';

import type { GoalFormOutput, GoalFormValues } from '../../../lib/goal-form';

import { addGoal } from '../../../api';
import { GOAL_FORM } from '../../../config';
import { goalFormSchema, toGoalInput } from '../../../lib/goal-form';
import { useMeMutation } from '../use-me-mutation';
import { useMeSection } from '../use-me-section';

export const useGoalForm = () => {
  const { data: accounts } = useMeSection({ section: 'accounts', fetcher: getLinkedAccounts });
  const add = useMeMutation({ section: 'goals', mutationFn: addGoal, successKey: 'goalAdded' });
  const form = useForm<GoalFormValues, unknown, GoalFormOutput>({
    resolver: zodResolver(goalFormSchema),
    defaultValues: GOAL_FORM.defaultValues,
    reValidateMode: 'onSubmit'
  });

  const accountId = accounts?.lesta.find(({ isPrimary }) => isPrimary)?.accountId ?? accounts?.lesta[0]?.accountId;

  const onSubmit = form.handleSubmit((values) => {
    if (accountId === undefined) {
      return;
    }

    add.mutate(toGoalInput({ values, accountId, now: new Date() }), { onSuccess: () => form.resetField('target') });
  });

  return {
    form,
    durations: GOAL_FORM.durations,
    isInvalid: form.formState.errors.target !== undefined,
    isDisabled: add.isPending || accountId === undefined,
    onSubmit
  };
};
