'use client';

import type { FormEvent } from 'react';

import { useMutation } from '@tanstack/react-query';
import { Mail } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';

import { sendMagicLink } from '@/shared/api/auth';
import { env } from '@/shared/config';
import { ROUTES } from '@/shared/constants';
import { Badge, Button, Input } from '@/ui-kit';

import { useCompleteSignIn } from '../../../model/hooks';

import s from './MagicLinkForm.module.scss';

const emailSchema = z.email();

export const MagicLinkForm = () => {
  const t = useTranslations('auth.magic');
  const completeSignIn = useCompleteSignIn();

  const send = useMutation({
    mutationFn: sendMagicLink,
    onSuccess: () => {
      toast.success(t('sent'));

      if (env.NEXT_PUBLIC_USE_MOCKS) {
        void completeSignIn();
      }
    },
    onError: () => toast.error(t('failed'))
  });

  const [isInvalid, setIsInvalid] = useState(false);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const parsed = emailSchema.safeParse(new FormData(event.currentTarget).get('email'));

    setIsInvalid(!parsed.success);

    if (parsed.success) {
      send.mutate({ email: parsed.data, callbackURL: new URL(ROUTES.me, window.location.origin).toString() });
    }
  };

  return (
    <form noValidate className={s.root} onSubmit={onSubmit}>
      <div className={s.head}>
        <span className={s.title}>{t('title')}</span>
        <Badge tone='warning'>{t('dev')}</Badge>
      </div>
      <Input
        aria-label={t('email')}
        autoComplete='email'
        icon={<Mail size={15} />}
        isInvalid={isInvalid}
        name='email'
        placeholder={t('placeholder')}
        type='email'
      />
      {isInvalid && <p className={s.error}>{t('invalid')}</p>}
      <Button block disabled={send.isPending} type='submit' variant='ghost'>
        {t('submit')}
      </Button>
    </form>
  );
};
