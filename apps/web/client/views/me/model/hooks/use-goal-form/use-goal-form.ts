'use client';

import type { VehicleSummary } from '@otmetki/schemas';

import { zodResolver } from '@hookform/resolvers/zod';
import { goalMetricSchema, isGoalTankMetric } from '@otmetki/schemas';
import { useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useForm, useWatch } from 'react-hook-form';

import { useLinkedAccounts } from '@/entities/auth/session';
import { vehicleIndex } from '@/entities/tank/tank';
import { useVehicleCatalog } from '@/features/tank/pick-tank';
import { QUERY_KEYS } from '@/shared/constants';

import type { GoalFormOutput, GoalFormValues } from '../../../lib/goal-form';

import { addGoal } from '../../../api';
import { GOAL_FORM } from '../../../config';
import { goalFormSchema, toGoalInput } from '../../../lib/goal-form';

export const useGoalForm = () => {
  const t = useTranslations('me.goals');
  const { data: accounts } = useLinkedAccounts();
  const { data: catalog } = useVehicleCatalog();
  const add = useMutation({
    mutationFn: addGoal,
    meta: { successKey: 'me.toast.goalAdded', errorKey: 'me.toast.failed', invalidates: [QUERY_KEYS.me.section('goals')] }
  });

  const form = useForm<GoalFormValues, unknown, GoalFormOutput>({
    resolver: zodResolver(goalFormSchema),
    defaultValues: GOAL_FORM.defaultValues,
    reValidateMode: 'onSubmit'
  });

  const [metric, tankId] = useWatch({ control: form.control, name: ['metric', 'tankId'] });

  const accountId = accounts?.lesta.find(({ isPrimary }) => isPrimary)?.accountId ?? accounts?.lesta[0]?.accountId;

  const onSubmit = form.handleSubmit((values) => {
    if (accountId === undefined) {
      return;
    }

    add.mutate(toGoalInput({ values, accountId, now: new Date() }), { onSuccess: () => form.resetField('target') });
  });

  return {
    form,
    metric,
    metricItems: goalMetricSchema.options.map((value) => ({ value, label: t(`metric.${value}`) })),
    durationItems: GOAL_FORM.durations.map((value) => ({ value, label: t('duration', { count: Number(value) }) })),
    hasTank: isGoalTankMetric(metric),
    tank: typeof tankId === 'number' ? (vehicleIndex(catalog)[tankId] ?? null) : null,
    onTankChange: (vehicle: VehicleSummary | null) => form.setValue('tankId', vehicle?.tankId, { shouldValidate: form.formState.isSubmitted }),
    isInvalid: form.formState.errors.target !== undefined,
    isTankInvalid: form.formState.errors.tankId !== undefined,
    isDisabled: add.isPending || accountId === undefined,
    onSubmit
  };
};
