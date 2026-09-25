'use client';

import { ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { useFormatter, useTranslations } from 'next-intl';

import { ratingValueTone, winRateTone } from '@/entities/player/stats';
import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { percentText, ROW_ITEM, SPRING } from '@/shared/lib';
import { RatingBadge } from '@/ui-kit';

import type { ClanRatingRowProps } from './ClanRatingRow.types';

import { CLAN_RATING } from '../../../config';
import { clanAccent } from '../../../lib/clan-accent';

import s from './ClanRatingRow.module.scss';

export const ClanRatingRow = ({ item, rank }: ClanRatingRowProps) => {
  const t = useTranslations('clans.rating');
  const format = useFormatter();

  const { clan, avgWn8, avgWinRate, activeMembers7d } = item;

  return (
    <motion.li layout custom={rank} transition={SPRING} variants={ROW_ITEM}>
      <Link
        className={s.row}
        data-podium={rank <= CLAN_RATING.podium ? rank : undefined}
        href={ROUTES.clan(clan.tag)}
        style={{ '--clan': clan.color ?? clanAccent(clan.tag) }}
      >
        <span aria-label={t('rank', { rank })} className={s.rank}>
          {String(rank).padStart(2, '0')}
        </span>
        <span className={s.identity}>
          <span className={s.tag}>[{clan.tag}]</span>
          <span className={s.name}>{clan.name}</span>
        </span>
        <span className={s.metric}>
          <span className={s.label}>{t('wn8')}</span>
          {avgWn8.value === null ? (
            <span className={s.dim}>—</span>
          ) : (
            <RatingBadge tone={ratingValueTone(avgWn8)} value={format.number(Math.round(avgWn8.value))} />
          )}
        </span>
        <span data-optional className={s.metric}>
          <span className={s.label}>{t('winRate')}</span>
          <RatingBadge size='sm' tone={winRateTone(avgWinRate)} value={percentText({ format, value: avgWinRate })} withPips={false} />
        </span>
        <span data-optional className={s.metric}>
          <span className={s.label}>{t('members')}</span>
          <span className={s.number}>
            {activeMembers7d === null ? format.number(clan.membersCount) : t('active', { active: activeMembers7d, total: clan.membersCount })}
          </span>
        </span>
        <ChevronRight aria-hidden className={s.chevron} size={18} />
      </Link>
    </motion.li>
  );
};
