'use client';

import { useTranslations } from 'next-intl';

import { useCountdown } from '../../../model/hooks';

import s from './Countdown.module.scss';

export const Countdown = () => {
  const t = useTranslations('play.result');
  const clock = useCountdown();

  return (
    <p className={s.root}>
      <span className={s.label}>{t('next')}</span>
      <time suppressHydrationWarning className={s.clock}>
        {clock}
      </time>
    </p>
  );
};
