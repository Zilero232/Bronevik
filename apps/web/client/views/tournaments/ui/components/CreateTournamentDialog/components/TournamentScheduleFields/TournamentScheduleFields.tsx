'use client';

import { useTranslations } from 'next-intl';
import { useId } from 'react';
import { useFormContext } from 'react-hook-form';

import { FormField, Input } from '@/ui-kit';

import type { TournamentFormOutput, TournamentFormValues } from '../../../../../lib/tournament-form';

import s from './TournamentScheduleFields.module.scss';

export const TournamentScheduleFields = () => {
  const t = useTranslations('tournaments.create');
  const id = useId();
  const { register, formState } = useFormContext<TournamentFormValues, unknown, TournamentFormOutput>();
  const { errors } = formState;

  return (
    <div className={s.root}>
      <FormField error={errors.startsAt && t('startsAtError')} htmlFor={`${id}-starts`} label={t('startsAt')}>
        <Input id={`${id}-starts`} isInvalid={Boolean(errors.startsAt)} size='sm' type='datetime-local' {...register('startsAt')} />
      </FormField>
      <FormField error={errors.registrationEndsAt && t('registrationEndsAtError')} htmlFor={`${id}-reg`} label={t('registrationEndsAt')}>
        <Input id={`${id}-reg`} isInvalid={Boolean(errors.registrationEndsAt)} size='sm' type='datetime-local' {...register('registrationEndsAt')} />
      </FormField>
      <FormField error={errors.maxParticipants && t('maxParticipantsError')} htmlFor={`${id}-max`} label={t('maxParticipants')}>
        <Input id={`${id}-max`} inputMode='numeric' isInvalid={Boolean(errors.maxParticipants)} size='sm' {...register('maxParticipants')} />
      </FormField>
    </div>
  );
};
