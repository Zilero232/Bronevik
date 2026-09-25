'use client';

import { LogIn } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { match } from 'ts-pattern';

import { useAuthSession } from '@/entities/auth/session';
import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { buttonVariants, EmptyState, Skeleton } from '@/ui-kit';

import type { AccountShellProps } from './AccountShell.types';

import { AccountNav } from './components';

import s from './AccountShell.module.scss';

export const AccountShell = ({ children }: AccountShellProps) => {
  const t = useTranslations('me');
  const { data: session, isPending } = useAuthSession();

  return (
    <div className={s.root}>
      {match({ isPending, isSignedIn: Boolean(session) })
        .with({ isPending: true }, () => (
          <div aria-busy className={s.skeleton}>
            <Skeleton height={40} shape='block' />
            <Skeleton height={96} shape='block' />
            <Skeleton height={320} shape='block' />
          </div>
        ))
        .with({ isSignedIn: false }, () => (
          <EmptyState
            action={
              <Link className={buttonVariants({ variant: 'primary' })} href={ROUTES.login}>
                <LogIn size={16} />
                {t('signIn')}
              </Link>
            }
            code='401'
            description={t('guestDescription')}
            title={t('guestTitle')}
          />
        ))
        .otherwise(() => (
          <>
            <AccountNav />
            {children}
          </>
        ))}
    </div>
  );
};
