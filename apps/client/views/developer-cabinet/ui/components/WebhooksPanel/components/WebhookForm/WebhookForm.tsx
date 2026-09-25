'use client';

import type { WebhookEvent } from '@bronevik/schemas';

import { WEBHOOK } from '@bronevik/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Controller, useForm } from 'react-hook-form';

import { createWebhook, updateWebhook } from '@/shared/api/developer';
import { QUERY_KEYS } from '@/shared/constants';
import { Button, buttonVariants, DialogClose, DialogFooter, Input, ToggleChips } from '@/ui-kit';

import type { WebhookFormValues } from '../../../../../lib/webhook-form';
import type { WebhookFormProps } from './WebhookForm.types';

import { WEBHOOK_EVENT_KEYS } from '../../../../../config';
import { isWebhookFormError, toWebhookFormValues, toWebhookInput, webhookFormSchema } from '../../../../../lib/webhook-form';
import { useDeveloperMutation } from '../../../../../model/hooks';
import { FormField } from '../../../FormField';

import s from './WebhookForm.module.scss';

const DEFAULT_VALUES = toWebhookFormValues(null);
const INVALIDATES = [QUERY_KEYS.me.developer.webhooks];

export const WebhookForm = ({ endpoint, onCreated, onSaved }: WebhookFormProps) => {
  const t = useTranslations('developer.webhookForm');
  const create = useDeveloperMutation({ mutationFn: createWebhook, invalidates: INVALIDATES, successKey: 'webhookCreated', isErrorToasted: false });
  const update = useDeveloperMutation({ mutationFn: updateWebhook, invalidates: INVALIDATES, successKey: 'webhookUpdated', isErrorToasted: false });
  const {
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    setError
  } = useForm<WebhookFormValues>({
    resolver: zodResolver(webhookFormSchema),
    defaultValues: endpoint ? toWebhookFormValues(endpoint) : DEFAULT_VALUES
  });

  const idsError = (message: string | undefined) => isWebhookFormError(message) && t(`errors.${message}`, { max: WEBHOOK.maxFilterIds });

  const onSubmit = handleSubmit(async (values) => {
    const input = toWebhookInput(values);

    try {
      if (endpoint) {
        await update.mutateAsync({ id: endpoint.id, ...input });
        onSaved();

        return;
      }

      onCreated((await create.mutateAsync(input)).secret);
    } catch {
      setError('root.server', { message: 'server' });
    }
  });

  return (
    <form noValidate className={s.root} onSubmit={onSubmit}>
      <FormField error={errors.url && t('errors.url')} hint={t('urlHint')} label={t('url')}>
        <Input inputMode='url' isInvalid={Boolean(errors.url)} placeholder='https://' type='url' {...register('url')} />
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
      <FormField error={idsError(errors.accountIds?.message)} hint={t('idsHint', { max: WEBHOOK.maxFilterIds })} label={t('accountIds')}>
        <Input inputMode='numeric' isInvalid={Boolean(errors.accountIds)} placeholder={t('accountIdsPlaceholder')} {...register('accountIds')} />
      </FormField>
      <FormField error={idsError(errors.clanIds?.message)} hint={t('clanIdsHint')} label={t('clanIds')}>
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
