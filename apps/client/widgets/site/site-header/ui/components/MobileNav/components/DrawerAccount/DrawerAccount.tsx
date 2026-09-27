'use client';

import { clsx } from 'clsx';
import { ChevronRight, LogIn } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { useLoginHref } from '@/entities/auth/session';
import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { Avatar, buttonVariants, Skeleton } from '@/ui-kit';

import type { DrawerAccountProps } from './DrawerAccount.types';

import { useAccountMenu } from '../../../../../model/hooks';

import s from './DrawerAccount.module.scss';

export const DrawerAccount = ({ onNavigate }: DrawerAccountProps) => {
  const t = useTranslations('nav.account');
  const loginHref = useLoginHref();
  const { user, isPending } = useAccountMenu();

  if (isPending) {
    return <Skeleton height={56} shape='block' />;
  }

  if (!user) {
    return (
      <div className={s.guest}>
        <Link className={clsx(buttonVariants({ variant: 'primary', size: 'md' }), s.signIn)} href={loginHref} onClick={onNavigate}>
          <LogIn aria-hidden size={16} />
          {t('drawerSignIn')}
        </Link>
        <span className={s.hint}>{t('drawerHint')}</span>
      </div>
    );
  }

  return (
    <Link className={s.user} href={ROUTES.account.overview} onClick={onNavigate}>
      <Avatar name={user.name} size='md' src={user.image ?? undefined} />
      <span className={s.name}>
        {user.name}
        <span className={s.hint}>{t('profile')}</span>
      </span>
      <ChevronRight aria-hidden className={s.chevron} size={18} />
    </Link>
  );
};
