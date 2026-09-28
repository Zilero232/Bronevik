'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';

import { useLinkedAccounts } from '@/entities/auth/session';
import { QUERY_KEYS } from '@/shared/constants';

import type { GoalFormOutput, GoalFormValues } from '../../../lib/goal-form';

import { addGoal } from '../../../api';
import { GOAL_FORM } from '../../../config';
import { goalFormSchema, toGoalInput } from '../../../lib/goal-form';

export const useGoalForm = () => {
  const { data: accounts } = useLinkedAccounts();
  const add = useMutation({
    mutationFn: addGoal,
    meta: { successKey: 'me.toast.goalAdded', errorKey: 'me.toast.failed', invalidates: [QUERY_KEYS.me.section('goals')] }
  });

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
