'use client';

import { BarChart3, History, Target } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { NicknameForm } from '@/features/player/own-nickname';

import type { DashboardAskProps } from './DashboardAsk.types';

import { HOME_ICON } from '../../../../../config';

import s from './DashboardAsk.module.scss';

export const DashboardAsk = ({ className }: DashboardAskProps) => {
  const t = useTranslations('home.dashboard.ask');

  return (
    <div className={className}>
      <div className={s.inner}>
        <div className={s.main}>
          <h3 className={s.title}>{t('title')}</h3>
          <p className={s.lead}>{t('lead')}</p>
          <NicknameForm isLabelShown={false} size='lg' />
        </div>
        <ul className={s.points}>
          <li className={s.point}>
            <BarChart3 aria-hidden size={HOME_ICON.dashboard} />
            {t('points.stats')}
          </li>
          <li className={s.point}>
            <Target aria-hidden size={HOME_ICON.dashboard} />
            {t('points.marks')}
          </li>
          <li className={s.point}>
            <History aria-hidden size={HOME_ICON.dashboard} />
            {t('points.session')}
          </li>
        </ul>
      </div>
    </div>
  );
};
