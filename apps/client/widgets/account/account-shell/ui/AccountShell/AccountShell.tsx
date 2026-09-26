'use client';

import { LogIn } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { match } from 'ts-pattern';

import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { buttonVariants, EmptyState, ErrorState, Skeleton } from '@/ui-kit';

import type { AccountShellProps } from './AccountShell.types';

import { ACCOUNT_SHELL } from '../../config';
import { useAccountShell } from '../../model/hooks';
import { AccountNav } from './components';

import s from './AccountShell.module.scss';

export const AccountShell = ({ children }: AccountShellProps) => {
  const t = useTranslations('me');
  const { state, isRetrying, retry } = useAccountShell();

  return (
    <div className={s.root}>
      {match(state)
        .with({ isPending: true }, () => (
          <div aria-busy className={s.skeleton}>
            {ACCOUNT_SHELL.skeletonHeights.map((height) => (
              <Skeleton key={height} height={height} shape='block' />
            ))}
          </div>
        ))
        .with({ isFailed: true }, () => <ErrorState isRetrying={isRetrying} onRetry={retry} />)
        .with({ isSignedIn: false }, () => (
          <EmptyState
            action={
              <Link className={buttonVariants({ variant: 'primary', size: 'sm' })} href={ROUTES.auth.login}>
                <LogIn size={14} />
                {t('signIn')}
              </Link>
            }
            description={t('guestDescription')}
            title={t('guestTitle')}
          />
        ))
        .otherwise(() => (
          <div className={s.layout}>
            <AccountNav />
            <div className={s.content}>{children}</div>
          </div>
        ))}
    </div>
  );
};
