'use client';

import { BRONYA_INDEX } from '@bronevik/ratings';
import { X } from 'lucide-react';
import { motion } from 'motion/react';
import { useFormatter, useTranslations } from 'next-intl';

import { usePlayerProfile } from '@/entities/player/profile';
import { ratingValueTone } from '@/entities/player/stats';
import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { SCALE_IN } from '@/shared/lib';
import { Avatar, IconButton, ProgressRing, Skeleton } from '@/ui-kit';

import type { PlayerSlotProps } from './PlayerSlot.types';

import s from './PlayerSlot.module.scss';

export const PlayerSlot = ({ accountId, index, onRemove }: PlayerSlotProps) => {
  const t = useTranslations('compare');
  const format = useFormatter();
  const { data: profile, isError } = usePlayerProfile(String(accountId));

  const summary = profile?.summary;
  const broneIndex = summary?.overall.broneIndex;

  return (
    <motion.article animate='visible' className={s.root} data-slot={index} initial='hidden' variants={SCALE_IN}>
      <span className={s.index}>{String(index + 1).padStart(2, '0')}</span>
      <IconButton aria-label={t('remove')} className={s.remove} size='sm' onClick={onRemove}>
        <X size={16} />
      </IconButton>
      {isError && <p className={s.error}>{t('slotError', { id: accountId })}</p>}
      {!summary && !isError && <Skeleton height={64} shape='block' />}
      {summary && broneIndex && (
        <div className={s.body}>
          <Avatar name={summary.nickname} size='md' />
          <div className={s.text}>
            <Link className={s.nickname} href={ROUTES.player(summary.nickname)}>
              {summary.nickname}
            </Link>
            <span className={s.clan}>{summary.clan ? `[${summary.clan.tag}]` : t('noClan')}</span>
          </div>
          <ProgressRing
            label={t('broneIndex')}
            max={BRONYA_INDEX.scale}
            size={72}
            thickness={5}
            tone={ratingValueTone(broneIndex)}
            value={broneIndex.value ?? 0}
          >
            <span className={s.bi}>{format.number(broneIndex.value ?? 0, { useGrouping: false })}</span>
          </ProgressRing>
        </div>
      )}
    </motion.article>
  );
};
