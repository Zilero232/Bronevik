'use client';

import { ExternalLink } from 'lucide-react';
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
        <Link className={buttonVariants()} href={ROUTES.account.overview}>
          {t('account')}
        </Link>
      </div>
    ))
    .otherwise(() => (
      <div className={s.root}>
        <a className={buttonVariants()} href={TELEGRAM_BOT.url} rel='noreferrer' target='_blank'>
          {t('openBot', { bot: `@${TELEGRAM_BOT.username}` })}
          <ExternalLink size={14} />
        </a>
        <Link className={buttonVariants({ variant: 'ghost' })} href={ROUTES.auth.login}>
          {t('otherWays')}
        </Link>
      </div>
    ));
};
