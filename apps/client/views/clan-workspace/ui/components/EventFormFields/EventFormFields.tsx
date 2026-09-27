'use client';

import { useTranslations } from 'next-intl';
import { useId } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { FormField, Input, Select } from '@/ui-kit';

import type { EventFormValues } from '../../../lib/event-form';

import { useEventFormOptions } from '../../../model/hooks';

import s from './EventFormFields.module.scss';

export const EventFormFields = () => {
  const t = useTranslations('clanWorkspace.form');
  const id = useId();
  const form = useFormContext<EventFormValues>();
  const { kinds, reminders } = useEventFormOptions();
  const { errors } = form.formState;

  return (
    <>
      <FormField error={errors.title && t('titleError')} htmlFor={`${id}-title`} label={t('title')}>
        <Input id={`${id}-title`} isInvalid={Boolean(errors.title)} placeholder={t('titlePlaceholder')} {...form.register('title')} />
      </FormField>
      <Controller
        control={form.control}
        name='kind'
        render={({ field }) => <Select items={kinds} label={t('kind')} value={field.value} onValueChange={field.onChange} />}
      />
      <div className={s.pair}>
        <FormField error={errors.startsAt && t('startsAtError')} htmlFor={`${id}-starts`} label={t('startsAt')}>
          <Input id={`${id}-starts`} isInvalid={Boolean(errors.startsAt)} size='sm' type='datetime-local' {...form.register('startsAt')} />
        </FormField>
        <FormField error={errors.endsAt && t('endsAtError')} hint={t('endsAtHint')} htmlFor={`${id}-ends`} label={t('endsAt')}>
          <Input id={`${id}-ends`} isInvalid={Boolean(errors.endsAt)} size='sm' type='datetime-local' {...form.register('endsAt')} />
        </FormField>
      </div>
      <Controller
        control={form.control}
        name='remind'
        render={({ field }) => <Select items={reminders} label={t('remind')} value={field.value} onValueChange={field.onChange} />}
      />
    </>
  );
};
