'use client';

import { useTranslations } from 'next-intl';

import { NicknameForm } from '@/features/player/own-nickname';
import { Button } from '@/ui-kit';

import type { DashboardSwitchProps } from './DashboardSwitch.types';

import s from './DashboardSwitch.module.scss';

export const DashboardSwitch = ({ onForget }: DashboardSwitchProps) => {
  const t = useTranslations('home.dashboard');

  return (
    <div className={s.root}>
      <NicknameForm className={s.form} isLabelShown={false} />
      <Button size='sm' variant='ghost' onClick={onForget}>
        {t('forget')}
      </Button>
    </div>
  );
};
