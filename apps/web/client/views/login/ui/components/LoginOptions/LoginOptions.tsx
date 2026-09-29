'use client';

import { ArrowRight, ShieldCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Suspense } from 'react';

import { useAuthSession } from '@/entities/auth/session';
import { LestaIdButton } from '@/features/auth/lesta-link';
import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';

import type { LoginOptionsProps } from './LoginOptions.types';

import { LOGIN_OPTIONS, LOGIN_SECTIONS } from '../../../config';
import { loginErrorKey } from '../../../lib/login-error';
import { useLoginReturn } from '../../../model/hooks';
import { LestaHint } from '../LestaHint';
import { MagicLinkForm } from '../MagicLinkForm';
import { SignInClosed } from '../SignInClosed';
import { TelegramLogin } from '../TelegramLogin';

import s from './LoginOptions.module.scss';

export const LoginOptions = ({ error }: LoginOptionsProps) => {
  const t = useTranslations('auth');
  const { data: session } = useAuthSession();
  const { returnPath, errorPath } = useLoginReturn();

  return (
    <section aria-labelledby={LOGIN_SECTIONS.signIn} className={s.root}>
      <header className={s.head}>
        <span className={s.kicker}>{t('kicker')}</span>
        <h1 className={s.title} id={LOGIN_SECTIONS.signIn}>
          {t('title')}
        </h1>
        <p className={s.lead}>{t('lead')}</p>
      </header>
      {error !== null && (
        <p className={s.error} role='alert'>
          {t(`errors.${loginErrorKey(error)}`)}
        </p>
      )}
      {session && (
        <Link className={s.signedIn} href={returnPath}>
          {t('signedInAs', { name: session.user.name })}
          <ArrowRight aria-hidden size={14} />
        </Link>
      )}
      <Suspense fallback={null}>
        <SignInClosed />
      </Suspense>
      <div aria-label={t('methods')} className={s.methods} role='group'>
        <span className={s.methodsLabel}>{t('methods')}</span>
        <LestaIdButton block callbackPath={returnPath} errorPath={errorPath} label={t('lesta')} size='lg' />
        <Suspense fallback={null}>
          <LestaHint className={s.hint} />
        </Suspense>
        <div className={s.divider}>
          <span>{t('or')}</span>
        </div>
        <TelegramLogin />
        {LOGIN_OPTIONS.isDevAuth && <MagicLinkForm />}
      </div>
      <footer className={s.foot}>
        <p className={s.safety}>
          <ShieldCheck aria-hidden className={s.safetyIcon} size={18} />
          <span>{t('safety')}</span>
        </p>
        <p className={s.consent}>
          {t.rich('consent', {
            terms: (chunks) => (
              <Link className={s.legal} href={ROUTES.legal.terms}>
                {chunks}
              </Link>
            ),
            privacy: (chunks) => (
              <Link className={s.legal} href={ROUTES.legal.privacy}>
                {chunks}
              </Link>
            )
          })}
        </p>
      </footer>
    </section>
  );
};
