'use client';

import type { WebhookEvent } from '@otmetki/schemas';

import { WEBHOOK } from '@otmetki/schemas';
import { Save } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Controller } from 'react-hook-form';

import { Button, buttonVariants, DialogClose, DialogFooter, Input, ToggleChips } from '@/ui-kit';

import type { WebhookFormProps } from './WebhookForm.types';

import { WEBHOOK_EVENT_KEYS, WEBHOOK_FORM } from '../../../../../config';
import { useWebhookForm } from '../../../../../model/hooks';
import { FormField } from '../../../FormField';

import s from './WebhookForm.module.scss';

export const WebhookForm = ({ endpoint, onCreated, onSaved }: WebhookFormProps) => {
  const t = useTranslations('developer.webhookForm');
  const { control, errors, idsErrors, isSubmitting, register, onSubmit } = useWebhookForm({ endpoint, onCreated, onSaved });

  return (
    <form noValidate className={s.root} onSubmit={onSubmit}>
      <FormField error={errors.url && t('errors.url')} hint={t('urlHint')} label={t('url')}>
        <Input inputMode='url' isInvalid={Boolean(errors.url)} placeholder={WEBHOOK_FORM.urlPlaceholder} type='url' {...register('url')} />
      </FormField>
      <fieldset className={s.group}>
        <legend className={s.label}>{t('events')}</legend>
        <Controller
          render={({ field }) => (
            <ToggleChips<WebhookEvent>
              aria-label={t('events')}
              options={WEBHOOK.events.map((event) => ({ value: event, label: t(`eventNames.${WEBHOOK_EVENT_KEYS[event]}`), title: event }))}
              size='sm'
              value={field.value}
              onChange={field.onChange}
            />
          )}
          control={control}
          name='events'
        />
        {errors.events && <span className={s.error}>{t('errors.events')}</span>}
      </fieldset>
      <FormField error={idsErrors.accountIds} hint={t('idsHint', { max: WEBHOOK.maxFilterIds })} label={t('accountIds')}>
        <Input inputMode='numeric' isInvalid={Boolean(errors.accountIds)} placeholder={t('accountIdsPlaceholder')} {...register('accountIds')} />
      </FormField>
      <FormField error={idsErrors.clanIds} hint={t('clanIdsHint')} label={t('clanIds')}>
        <Input inputMode='numeric' isInvalid={Boolean(errors.clanIds)} placeholder={t('clanIdsPlaceholder')} {...register('clanIds')} />
      </FormField>
      {errors.root?.server && <p className={s.error}>{t('errors.server')}</p>}
      <DialogFooter>
        <DialogClose className={buttonVariants({ variant: 'ghost' })}>{t('cancel')}</DialogClose>
        <Button disabled={isSubmitting} type='submit'>
          <Save size={16} />
          {t(endpoint ? 'save' : 'submit')}
        </Button>
      </DialogFooter>
    </form>
  );
};
