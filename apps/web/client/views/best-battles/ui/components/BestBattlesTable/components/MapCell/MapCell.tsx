'use client';

import { useTranslations } from 'next-intl';

import { RelativeTime } from '@/ui-kit';

import type { MapCellProps } from './MapCell.types';

import s from './MapCell.module.scss';

export const MapCell = ({ battle: { arena, playedAt, result } }: MapCellProps) => {
  const t = useTranslations('bestBattles');

  return (
    <span className={s.root}>
      <span className={s.name}>{arena?.name ?? t('unknownMap')}</span>
      <span className={s.meta}>
        {result && (
          <span className={s.result} data-result={result}>
            {t(`results.${result}`)}
          </span>
        )}
        <RelativeTime value={playedAt} />
      </span>
    </span>
  );
};
