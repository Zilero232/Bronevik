'use client';

import { useTranslations } from 'next-intl';

import type { ResetCountdownProps } from './ResetCountdown.types';

import { useResetCountdown } from '../../../../../model/hooks';

import s from './ResetCountdown.module.scss';

export const ResetCountdown = ({ nextResetAt }: ResetCountdownProps) => {
  const t = useTranslations('analytics.firstWin');
  const clock = useResetCountdown(nextResetAt);

  return (
    <span className={s.root}>
      <span className={s.label}>{t('resetIn')}</span>
      <time suppressHydrationWarning className={s.clock} dateTime={nextResetAt}>
        {clock}
      </time>
    </span>
  );
};
