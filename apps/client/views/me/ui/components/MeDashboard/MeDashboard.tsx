'use client';

import { LogOut } from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';

import { useSignOut } from '@/entities/auth/session';
import { STAGGER, STAGGER_ITEM } from '@/shared/lib';
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
    <motion.div animate='visible' className={s.root} initial='hidden' variants={STAGGER}>
      <motion.header className={s.header} variants={STAGGER_ITEM}>
        <Avatar name={name} size='lg' />
        <div className={s.greeting}>
          <span className={s.eyebrow}>{t('eyebrow')}</span>
          <h1 className={s.title}>{t('title', { name })}</h1>
        </div>
        <Button disabled={signOut.isPending} size='sm' variant='ghost' onClick={() => signOut.mutate()}>
          <LogOut size={15} />
          {t('signOut')}
        </Button>
      </motion.header>
      <div className={s.grid}>
        <motion.div className={s.wide} variants={STAGGER_ITEM}>
          <GoalsCard />
        </motion.div>
        <motion.div variants={STAGGER_ITEM}>
          <FavoritesCard />
        </motion.div>
        <motion.div variants={STAGGER_ITEM}>
          <LinkedAccountsCard />
        </motion.div>
        <motion.div variants={STAGGER_ITEM}>
          <ModBindCard />
        </motion.div>
        <motion.div variants={STAGGER_ITEM}>
          <NotificationsCard />
        </motion.div>
      </div>
    </motion.div>
  );
};
