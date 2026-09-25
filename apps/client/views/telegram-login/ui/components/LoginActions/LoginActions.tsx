'use client';

import { LayoutDashboard, LogIn, Send } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { match } from 'ts-pattern';

import { TELEGRAM_BOT } from '@/shared/config';
import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { buttonVariants } from '@/ui-kit';

import type { LoginActionsProps } from './LoginActions.types';

import s from './LoginActions.module.scss';

export const LoginActions = ({ phase }: LoginActionsProps) => {
  const t = useTranslations('telegram.webLogin.actions');

  return match(phase)
    .with('redeeming', () => null)
    .with('success', () => (
      <div className={s.root}>
        <Link className={buttonVariants({ size: 'lg' })} href={ROUTES.me}>
          <LayoutDashboard size={18} />
          {t('account')}
        </Link>
      </div>
    ))
    .otherwise(() => (
      <div className={s.root}>
        <a className={buttonVariants({ size: 'lg' })} href={TELEGRAM_BOT.url} rel='noreferrer' target='_blank'>
          <Send size={18} />
          {t('openBot', { bot: `@${TELEGRAM_BOT.username}` })}
        </a>
        <Link className={buttonVariants({ variant: 'ghost', size: 'lg' })} href={ROUTES.login}>
          <LogIn size={18} />
          {t('otherWays')}
        </Link>
      </div>
    ));
};
