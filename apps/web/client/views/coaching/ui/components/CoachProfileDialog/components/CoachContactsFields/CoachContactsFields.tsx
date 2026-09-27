'use client';

import { useTranslations } from 'next-intl';
import { useId } from 'react';
import { useFormContext } from 'react-hook-form';

import { FormField, Input } from '@/ui-kit';

import type { CoachFormOutput, CoachFormValues } from '../../../../../lib/coach-form';

import s from './CoachContactsFields.module.scss';

export const CoachContactsFields = () => {
  const t = useTranslations('coaching.profile');
  const id = useId();
  const { register, formState } = useFormContext<CoachFormValues, unknown, CoachFormOutput>();
  const errors = formState.errors.contacts;

  return (
    <fieldset className={s.root}>
      <legend className={s.legend}>{t('contacts')}</legend>
      <FormField error={errors?.telegram && t('linkError')} htmlFor={`${id}-tg`} label={t('telegram')}>
        <Input
          id={`${id}-tg`}
          isInvalid={Boolean(errors?.telegram)}
          placeholder={t('telegramPlaceholder')}
          size='sm'
          {...register('contacts.telegram')}
        />
      </FormField>
      <FormField error={errors?.vk && t('linkError')} htmlFor={`${id}-vk`} label={t('vk')}>
        <Input id={`${id}-vk`} isInvalid={Boolean(errors?.vk)} placeholder={t('vkPlaceholder')} size='sm' {...register('contacts.vk')} />
      </FormField>
      <FormField error={errors?.discord && t('discordError')} htmlFor={`${id}-discord`} label={t('discord')}>
        <Input id={`${id}-discord`} isInvalid={Boolean(errors?.discord)} size='sm' {...register('contacts.discord')} />
      </FormField>
      <FormField error={errors?.booking && t('linkError')} hint={t('bookingHint')} htmlFor={`${id}-booking`} label={t('booking')}>
        <Input
          id={`${id}-booking`}
          isInvalid={Boolean(errors?.booking)}
          placeholder={t('bookingPlaceholder')}
          size='sm'
          {...register('contacts.booking')}
        />
      </FormField>
    </fieldset>
  );
};
