'use client';

import { Cpu } from 'lucide-react';
import { motion } from 'motion/react';
import { useFormatter, useTranslations } from 'next-intl';

import { ratingValueTone, winRateTone } from '@/entities/player/stats';
import { percentText, ROW_ITEM } from '@/shared/lib';
import { Button, RatingBadge } from '@/ui-kit';

import type { SessionListProps } from './SessionList.types';

import s from './SessionList.module.scss';

export const SessionList = ({ items, selectedId, hasMore, isFetching, onSelect, onMore }: SessionListProps) => {
  const t = useTranslations('profile.sessions');
  const format = useFormatter();

  return (
    <nav aria-label={t('listLabel')} className={s.root}>
      <ul className={s.list}>
        {items.map(({ id, startedAt, stats, isLive, source }, index) => (
          <motion.li key={id} animate='visible' custom={index} initial='hidden' variants={ROW_ITEM}>
            <button aria-current={id === selectedId} className={s.item} type='button' onClick={() => onSelect(id)}>
              <span className={s.date}>
                <span className={s.day}>{format.dateTime(new Date(startedAt), { day: '2-digit' })}</span>
                <span className={s.month}>{format.dateTime(new Date(startedAt), { month: 'short', weekday: 'short' })}</span>
              </span>
              <span className={s.info}>
                <span className={s.battles}>
                  {isLive && <span aria-label={t('live')} className={s.live} />}
                  {t('battlesCount', { count: stats.battles })}
                  {source === 'mod' && <Cpu aria-label={t('source.mod')} className={s.mod} size={12} />}
                </span>
                <span className={s.rate} data-tone={winRateTone(stats.winRate)}>
                  {percentText({ format, value: stats.winRate })} · {format.number(stats.avgDamage ?? 0)}
                </span>
              </span>
              <RatingBadge size='sm' tone={ratingValueTone(stats.wn8)} value={format.number(stats.wn8.value ?? 0)} withPips={false} />
            </button>
          </motion.li>
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
