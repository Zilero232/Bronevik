'use client';

import { useTranslations } from 'next-intl';

import { ProgressBar } from '@/ui-kit';

import type { ChallengePlateProps } from './ChallengePlate.types';

import { Plate } from '../Plate';

import s from './ChallengePlate.module.scss';

export const ChallengePlate = ({ challenge }: ChallengePlateProps) => {
  const t = useTranslations('overlay.challenge');
  const { title, code, status, battles, battlesNeeded, value, target } = challenge;

  return (
    <Plate className={s.root} label={t('label')}>
      <span className={s.head}>
        <span className={s.code}>{code}</span>
        <span className={s.status} data-status={status}>
          {t(`status.${status}`)}
        </span>
      </span>
      <span className={s.title}>{title}</span>
      <ProgressBar max={Math.max(target, 1)} size='sm' value={Math.min(value, target)} />
      <span className={s.meta}>{t('battles', { done: battles, total: battlesNeeded })}</span>
    </Plate>
  );
};
