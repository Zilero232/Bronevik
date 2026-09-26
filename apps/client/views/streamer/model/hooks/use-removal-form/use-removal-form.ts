'use client';

import type { RemovalRequestInput } from '@otmetki/schemas';

import { zodResolver } from '@hookform/resolvers/zod';
import { removalRequestSchema } from '@otmetki/schemas';
import { useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { requestStreamerRemoval } from '@/shared/api/streamers';

import type { UseRemovalFormInput } from './use-removal-form.types';

import { REMOVAL_FORM_DEFAULT_VALUES } from '../../../config';

export const useRemovalForm = ({ slug, onSent }: UseRemovalFormInput) => {
  const t = useTranslations('streamersDirectory.public.removal');
  const send = useMutation({
    mutationFn: ({ contact, reason }: RemovalRequestInput) => requestStreamerRemoval({ slug, contact, reason: reason || undefined }),
    onSuccess: () => {
      toast.success(t('sent'));
      onSent();
    },
    onError: () => void toast.error(t('failed'))
  });

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<RemovalRequestInput>({ resolver: zodResolver(removalRequestSchema), defaultValues: REMOVAL_FORM_DEFAULT_VALUES });

  return {
    register,
    errors,
    isSubmitting: send.isPending,
    onSubmit: handleSubmit((values) => send.mutate(values))
  };
};
