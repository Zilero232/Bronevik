'use client';

import { useTranslations } from 'next-intl';
import { Controller, useFormContext } from 'react-hook-form';

import { TankIdsField } from '@/features/tank/pick-tank';

import type { PlatoonFormOutput, PlatoonFormValues } from '../../../../../lib/platoon-form';

import { PLATOON_BOARD } from '../../../../../config';

export const PlatoonTanksField = () => {
  const t = useTranslations('platoons.create');
  const { control } = useFormContext<PlatoonFormValues, unknown, PlatoonFormOutput>();

  return (
    <Controller
      render={({ field }) => (
        <TankIdsField
          label={t('tanks')}
          max={PLATOON_BOARD.maxTanks}
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
