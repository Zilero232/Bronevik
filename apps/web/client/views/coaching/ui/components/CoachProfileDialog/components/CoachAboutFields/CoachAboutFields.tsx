'use client';

import { useTranslations } from 'next-intl';
import { useId } from 'react';
import { useFormContext } from 'react-hook-form';

import { FormField, Input, Textarea } from '@/ui-kit';

import type { CoachFormOutput, CoachFormValues } from '../../../../../lib/coach-form';

import { COACH_FORM } from '../../../../../config';

export const CoachAboutFields = () => {
  const t = useTranslations('coaching.profile');
  const id = useId();
  const { register, formState } = useFormContext<CoachFormValues, unknown, CoachFormOutput>();
  const { errors } = formState;

  return (
    <>
      <FormField error={errors.headline && t('headlineError')} htmlFor={`${id}-headline`} label={t('headline')}>
        <Input id={`${id}-headline`} isInvalid={Boolean(errors.headline)} placeholder={t('headlinePlaceholder')} {...register('headline')} />
      </FormField>
      <FormField error={errors.bio && t('bioError')} htmlFor={`${id}-bio`} label={t('bio')}>
        <Textarea id={`${id}-bio`} isInvalid={Boolean(errors.bio)} placeholder={t('bioPlaceholder')} rows={COACH_FORM.bioRows} {...register('bio')} />
      </FormField>
    </>
  );
};
