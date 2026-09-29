'use client';

import { useTranslations } from 'next-intl';
import { useId } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { DateTimeField, FormField, Input, Select } from '@/ui-kit';

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
        <FormField error={errors.startsAt && t('startsAtError')} label={t('startsAt')}>
          <Controller
            control={form.control}
            name='startsAt'
            render={({ field }) => <DateTimeField isInvalid={Boolean(errors.startsAt)} value={field.value ?? ''} onChange={field.onChange} />}
          />
        </FormField>
        <FormField error={errors.endsAt && t('endsAtError')} hint={t('endsAtHint')} label={t('endsAt')}>
          <Controller
            control={form.control}
            name='endsAt'
            render={({ field }) => <DateTimeField isInvalid={Boolean(errors.endsAt)} value={field.value ?? ''} onChange={field.onChange} />}
          />
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
