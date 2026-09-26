'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { ROUTES } from '@/shared/constants';

import type { MagicLinkFormValues } from '../../../lib/magic-link-form';

import { sendMagicLink } from '../../../api';
import { MAGIC_LINK_FORM_DEFAULT_VALUES } from '../../../config';
import { magicLinkFormSchema } from '../../../lib/magic-link-form';

export const useMagicLinkForm = () => {
  const t = useTranslations('auth.magic');
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<MagicLinkFormValues>({ resolver: zodResolver(magicLinkFormSchema), defaultValues: MAGIC_LINK_FORM_DEFAULT_VALUES });

  const send = useMutation({
    mutationFn: sendMagicLink,
    onSuccess: () => toast.success(t('sent')),
    onError: () => setError('root', { type: 'server' })
  });

  const onSubmit = handleSubmit(({ email }) => {
    send.mutate({ email, callbackURL: new URL(ROUTES.account.overview, window.location.origin).toString() });
  });

  return {
    register,
    onSubmit,
    isInvalid: Boolean(errors.email),
    isFailed: Boolean(errors.root),
    isPending: send.isPending
  };
};
