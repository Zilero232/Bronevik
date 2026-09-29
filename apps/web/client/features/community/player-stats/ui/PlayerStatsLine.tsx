'use client';

import { clsx } from 'clsx';
import { useTranslations } from 'next-intl';

import type { PlayerStatsLineProps } from './PlayerStatsLine.types';

import { usePlayerStatsLine } from '../model/hooks';

import s from './PlayerStatsLine.module.scss';

export const PlayerStatsLine = ({ stats, className }: PlayerStatsLineProps) => {
  const t = useTranslations('community.stats');
  const cells = usePlayerStatsLine(stats);

  if (!cells) {
    return <span className={clsx(s.empty, className)}>{t('none')}</span>;
  }

  return (
    <dl className={clsx(s.root, className)}>
      {cells.map(({ key, value, tone }) => (
        <div key={key} className={s.item}>
          <dt className={s.label}>{t(key)}</dt>
          <dd className={s.value} data-tone={tone}>
            {value}
          </dd>
        </div>
      ))}
    </dl>
  );
};
