'use client';

import { useTranslations } from 'next-intl';
import { Controller, useFormContext } from 'react-hook-form';

import { TankIdsField } from '@/features/tank/pick-tank';

import type { CoachFormOutput, CoachFormValues } from '../../../../../lib/coach-form';

import { COACH_FORM } from '../../../../../config';

export const CoachTanksField = () => {
  const t = useTranslations('coaching.profile');
  const { control } = useFormContext<CoachFormValues, unknown, CoachFormOutput>();

  return (
    <Controller
      render={({ field }) => (
        <TankIdsField
          label={t('tanks')}
          max={COACH_FORM.maxTanks}
          placeholder={t('tanksPlaceholder')}
          value={field.value}
          onChange={field.onChange}
        />
      )}
      control={control}
      name='tankIds'
    />
  );
};
