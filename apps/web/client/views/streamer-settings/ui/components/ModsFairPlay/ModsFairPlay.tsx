'use client';

import { ShieldAlert } from 'lucide-react';
import { useTranslations } from 'next-intl';

import s from './ModsFairPlay.module.scss';

export const ModsFairPlay = () => {
  const t = useTranslations('streamerSettings');

  return (
    <p className={s.root}>
      <ShieldAlert size={14} />
      {t('common.fairPlay')}
    </p>
  );
};
