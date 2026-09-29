'use client';

import { useTranslations } from 'next-intl';

import { useLestaNotice } from '@/entities/app/lesta-notice';

import type { LestaHintProps } from './LestaHint.types';

export const LestaHint = ({ className }: LestaHintProps) => {
  const t = useTranslations('auth');
  const isNotConnected = useLestaNotice();

  if (isNotConnected) {
    return null;
  }

  return <p className={className}>{t('lestaHint')}</p>;
};
