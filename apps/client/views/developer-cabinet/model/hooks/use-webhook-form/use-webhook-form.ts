'use client';

import { WEBHOOK } from '@bronevik/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';

import { createWebhook, updateWebhook } from '@/shared/api/developer';

import type { WebhookFormValues } from '../../../lib/webhook-form';
import type { UseWebhookFormInput } from './use-webhook-form.types';

import { WEBHOOK_QUERIES } from '../../../config';
import { isWebhookFormError, toWebhookFormValues, toWebhookInput, webhookFormSchema } from '../../../lib/webhook-form';
import { useDeveloperMutation } from '../use-developer-mutation';

export const useWebhookForm = ({ endpoint, onCreated, onSaved }: UseWebhookFormInput) => {
  const t = useTranslations('developer.webhookForm');
  const create = useDeveloperMutation({
    mutationFn: createWebhook,
    invalidates: WEBHOOK_QUERIES.invalidates,
    successKey: 'webhookCreated',
    isErrorToasted: false
  });

  const update = useDeveloperMutation({
    mutationFn: updateWebhook,
    invalidates: WEBHOOK_QUERIES.invalidates,
    successKey: 'webhookUpdated',
    isErrorToasted: false
  });

  const {
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    setError
  } = useForm<WebhookFormValues>({ resolver: zodResolver(webhookFormSchema), defaultValues: toWebhookFormValues(endpoint) });

  const idsError = (message: string | undefined) => isWebhookFormError(message) && t(`errors.${message}`, { max: WEBHOOK.maxFilterIds });
  const idsErrors = { accountIds: idsError(errors.accountIds?.message), clanIds: idsError(errors.clanIds?.message) };

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

  return { control, errors, idsErrors, isSubmitting, register, onSubmit };
};
