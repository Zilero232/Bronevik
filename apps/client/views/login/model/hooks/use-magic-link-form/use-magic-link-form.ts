'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useLocale, useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { returnUrl } from '@/entities/auth/session';
import { resolveLocale } from '@/shared/i18n';

import type { MagicLinkFormValues } from '../../../lib/magic-link-form';

import { sendMagicLink } from '../../../api';
import { MAGIC_LINK_FORM_DEFAULT_VALUES } from '../../../config';
import { magicLinkFormSchema } from '../../../lib/magic-link-form';
import { useLoginReturn } from '../use-login-return';

export const useMagicLinkForm = () => {
  const t = useTranslations('auth.magic');
  const locale = resolveLocale(useLocale());
  const { returnPath, errorPath } = useLoginReturn();
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
    const { origin } = window.location;

    send.mutate({
      email,
      callbackURL: returnUrl({ path: returnPath, locale, origin }),
      errorCallbackURL: returnUrl({ path: errorPath, locale, origin })
    });
  });

  return {
    register,
    onSubmit,
    isInvalid: Boolean(errors.email),
    isFailed: Boolean(errors.root),
    isPending: send.isPending
  };
};
