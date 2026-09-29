'use client';

import { ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Suspense } from 'react';

import { useAuthSession } from '@/entities/auth/session';
import { LestaIdButton } from '@/features/auth/lesta-link';
import { Link } from '@/shared/i18n/navigation';
import { Card, CardBody } from '@/ui-kit';

import type { LoginOptionsProps } from './LoginOptions.types';

import { LOGIN_OPTIONS } from '../../../config';
import { loginErrorKey } from '../../../lib/login-error';
import { useLoginReturn } from '../../../model/hooks';
import { LestaHint } from '../LestaHint';
import { MagicLinkForm } from '../MagicLinkForm';
import { TelegramLogin } from '../TelegramLogin';

import s from './LoginOptions.module.scss';

export const LoginOptions = ({ error }: LoginOptionsProps) => {
  const t = useTranslations('auth');
  const { data: session } = useAuthSession();
  const { returnPath, errorPath } = useLoginReturn();

  return (
    <Card>
      <CardBody className={s.root}>
        {error !== null && (
          <p className={s.error} role='alert'>
            {t(`errors.${loginErrorKey(error)}`)}
          </p>
        )}
        {session && (
          <Link className={s.signedIn} href={returnPath}>
            {t('signedInAs', { name: session.user.name })}
            <ArrowRight size={14} />
          </Link>
        )}
        <LestaIdButton block callbackPath={returnPath} errorPath={errorPath} label={t('lesta')} size='lg' />
        <Suspense fallback={null}>
          <LestaHint className={s.hint} />
        </Suspense>
        <div className={s.divider}>
          <span>{t('or')}</span>
        </div>
        <TelegramLogin />
        {LOGIN_OPTIONS.isDevAuth && <MagicLinkForm />}
        <p className={s.hint}>{t('safety')}</p>
      </CardBody>
    </Card>
  );
};
