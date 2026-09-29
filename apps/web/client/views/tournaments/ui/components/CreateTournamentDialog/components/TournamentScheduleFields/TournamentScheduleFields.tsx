'use client';

import { useTranslations } from 'next-intl';
import { useId } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { DateTimeField, FormField, Input } from '@/ui-kit';

import type { TournamentFormOutput, TournamentFormValues } from '../../../../../lib/tournament-form';

import s from './TournamentScheduleFields.module.scss';

export const TournamentScheduleFields = () => {
  const t = useTranslations('tournaments.create');
  const id = useId();
  const { register, control, formState } = useFormContext<TournamentFormValues, unknown, TournamentFormOutput>();
  const { errors } = formState;

  return (
    <div className={s.root}>
      <FormField error={errors.startsAt && t('startsAtError')} label={t('startsAt')}>
        <Controller
          control={control}
          name='startsAt'
          render={({ field }) => <DateTimeField isInvalid={Boolean(errors.startsAt)} value={field.value ?? ''} onChange={field.onChange} />}
        />
      </FormField>
      <FormField error={errors.registrationEndsAt && t('registrationEndsAtError')} label={t('registrationEndsAt')}>
        <Controller
          control={control}
          name='registrationEndsAt'
          render={({ field }) => <DateTimeField isInvalid={Boolean(errors.registrationEndsAt)} value={field.value ?? ''} onChange={field.onChange} />}
        />
      </FormField>
      <FormField error={errors.maxParticipants && t('maxParticipantsError')} htmlFor={`${id}-max`} label={t('maxParticipants')}>
        <Input id={`${id}-max`} inputMode='numeric' isInvalid={Boolean(errors.maxParticipants)} size='sm' {...register('maxParticipants')} />
      </FormField>
    </div>
  );
};
