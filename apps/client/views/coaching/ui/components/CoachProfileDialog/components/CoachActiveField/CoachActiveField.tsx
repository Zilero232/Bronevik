'use client';

import { useTranslations } from 'next-intl';
import { Controller, useFormContext } from 'react-hook-form';

import { Switch } from '@/ui-kit';

import type { CoachFormOutput, CoachFormValues } from '../../../../../lib/coach-form';

export const CoachActiveField = () => {
  const t = useTranslations('coaching.profile');
  const { control } = useFormContext<CoachFormValues, unknown, CoachFormOutput>();

  return (
    <Controller
      control={control}
      name='isActive'
      render={({ field }) => <Switch checked={field.value} description={t('activeHint')} label={t('active')} onCheckedChange={field.onChange} />}
    />
  );
};
