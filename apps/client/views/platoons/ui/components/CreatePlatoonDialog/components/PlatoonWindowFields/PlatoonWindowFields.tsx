'use client';

import { useTranslations } from 'next-intl';
import { useId } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { FormField, Input, Select } from '@/ui-kit';

import type { PlatoonFormOutput, PlatoonFormValues } from '../../../../../lib/platoon-form';

import { PLATOON_BOARD } from '../../../../../config';

import s from './PlatoonWindowFields.module.scss';

export const PlatoonWindowFields = () => {
  const t = useTranslations('platoons.create');
  const id = useId();
  const { control, register, formState } = useFormContext<PlatoonFormValues, unknown, PlatoonFormOutput>();
  const { errors } = formState;

  return (
    <>
      <div className={s.row}>
        <FormField error={errors.minWn8 && t('minWn8Error')} htmlFor={`${id}-wn8`} label={t('minWn8')}>
          <Input id={`${id}-wn8`} inputMode='numeric' isInvalid={Boolean(errors.minWn8)} placeholder='0' size='sm' {...register('minWn8')} />
        </FormField>
        <Controller
          render={({ field }) => (
            <Select
              items={PLATOON_BOARD.expiresOptions.map((hours) => ({ value: String(hours), label: t('hours', { count: hours }) }))}
              label={t('expiresIn')}
              value={field.value}
              onValueChange={field.onChange}
            />
          )}
          control={control}
          name='expiresInHours'
        />
      </div>
      <div className={s.row}>
        <FormField htmlFor={`${id}-from`} label={t('availableFrom')}>
          <Input id={`${id}-from`} size='sm' type='datetime-local' {...register('availableFrom')} />
        </FormField>
        <FormField error={errors.availableUntil && t('windowError')} htmlFor={`${id}-until`} label={t('availableUntil')}>
          <Input id={`${id}-until`} isInvalid={Boolean(errors.availableUntil)} size='sm' type='datetime-local' {...register('availableUntil')} />
        </FormField>
      </div>
    </>
  );
};
