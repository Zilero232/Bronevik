'use client';

import { ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';

import { useAuthSession } from '@/entities/auth/session';
import { LestaIdButton } from '@/features/auth/lesta-link';
import { env } from '@/shared/config';
import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { SLIDE_UP } from '@/shared/lib';

import type { LoginOptionsProps } from './LoginOptions.types';

import { LOGIN } from '../../../config';
import { MagicLinkForm } from '../MagicLinkForm';
import { TelegramLogin } from '../TelegramLogin';

import s from './LoginOptions.module.scss';

const isDevAuth = env.NEXT_PUBLIC_USE_MOCKS || process.env.NODE_ENV !== 'production';

export const LoginOptions = ({ error }: LoginOptionsProps) => {
  const t = useTranslations('auth');
  const { data: session } = useAuthSession();

  return (
    <motion.section animate='visible' className={s.root} initial='hidden' variants={SLIDE_UP}>
      <span className={s.eyebrow}>{t('eyebrow')}</span>
      <h2 className={s.heading}>{t('heading')}</h2>
      {error && (
        <p className={s.error} role='alert'>
          {t(`errors.${LOGIN.errors.find((code) => code === error) ?? 'unknown'}`)}
        </p>
      )}
      {session && (
        <Link className={s.signedIn} href={ROUTES.me}>
          {t('signedInAs', { name: session.user.name })}
          <ArrowRight size={14} />
        </Link>
      )}
      <LestaIdButton block callbackPath={ROUTES.me} label={t('lesta')} size='lg' />
      <p className={s.hint}>{t('lestaHint')}</p>
      <div className={s.divider}>
        <span>{t('or')}</span>
      </div>
      <TelegramLogin />
      {isDevAuth && <MagicLinkForm />}
    </motion.section>
  );
};
