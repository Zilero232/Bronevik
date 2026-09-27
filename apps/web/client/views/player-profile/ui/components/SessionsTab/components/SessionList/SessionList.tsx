'use client';

import { useFormatter, useTranslations } from 'next-intl';

import { RatingValue } from '@/entities/player/stats';
import { WinRateCell } from '@/entities/tank/tank';
import { Button } from '@/ui-kit';

import type { SessionListProps } from './SessionList.types';

import s from './SessionList.module.scss';

export const SessionList = ({ items, selectedId, hasMore, isFetching, onSelect, onMore }: SessionListProps) => {
  const t = useTranslations('profile.sessions');
  const format = useFormatter();

  return (
    <nav aria-label={t('listLabel')} className={s.root}>
      <ul className={s.list}>
        {items.map(({ id, startedAt, stats, isLive, source }) => (
          <li key={id}>
            <button aria-current={id === selectedId} className={s.item} type='button' onClick={() => onSelect(id)}>
              <span className={s.date}>{format.dateTime(new Date(startedAt), { day: '2-digit', month: 'short', weekday: 'short' })}</span>
              <span className={s.info}>
                <span className={s.battles}>
                  {isLive && <span aria-label={t('live')} className={s.live} role='img' />}
                  {t('battlesCount', { count: stats.battles })}
                  {source === 'mod' && <span className={s.mod}>{t('source.mod')}</span>}
                </span>
                <span className={s.meta}>
                  <WinRateCell digits={1} value={stats.winRate} />
                  <span>{t('avgDamageShort', { value: format.number(stats.avgDamage ?? 0, { maximumFractionDigits: 0 }) })}</span>
                </span>
              </span>
              <RatingValue rating={stats.wn8} />
            </button>
          </li>
        ))}
      </ul>
      {hasMore && (
        <Button block disabled={isFetching} size='sm' variant='ghost' onClick={onMore}>
          {t('more')}
        </Button>
      )}
    </nav>
  );
};
