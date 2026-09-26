'use client';

import { LogOut } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { useSignOut } from '@/entities/auth/session';
import { Avatar, Button } from '@/ui-kit';

import type { MeDashboardProps } from './MeDashboard.types';

import { FavoritesCard } from '../FavoritesCard';
import { GoalsCard } from '../GoalsCard';
import { LinkedAccountsCard } from '../LinkedAccountsCard';
import { ModBindCard } from '../ModBindCard';
import { NotificationsCard } from '../NotificationsCard';

import s from './MeDashboard.module.scss';

export const MeDashboard = ({ name }: MeDashboardProps) => {
  const t = useTranslations('me');
  const signOut = useSignOut();

  return (
    <div className={s.root}>
      <header className={s.header}>
        <Avatar name={name} size='lg' />
        <div className={s.greeting}>
          <span className={s.eyebrow}>{t('eyebrow')}</span>
          <h1 className={s.title}>{t('title', { name })}</h1>
        </div>
        <Button disabled={signOut.isPending} size='sm' variant='ghost' onClick={() => signOut.mutate()}>
          <LogOut size={15} />
          {t('signOut')}
        </Button>
      </header>
      <div className={s.grid}>
        <div className={s.wide}>
          <GoalsCard />
        </div>
        <div>
          <FavoritesCard />
        </div>
        <div>
          <LinkedAccountsCard />
        </div>
        <div>
          <ModBindCard />
        </div>
        <div>
          <NotificationsCard />
        </div>
      </div>
    </div>
  );
};
