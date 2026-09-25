'use client';

import { ratingTier } from '@bronevik/ratings';
import { History, X } from 'lucide-react';
import { motion } from 'motion/react';
import { useFormatter, useTranslations } from 'next-intl';

import { PlayerIdentity } from '@/entities/player/player';
import { useRecentPlayers } from '@/entities/player/recent-players';
import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { STAGGER, STAGGER_ITEM, toneOfTier, useHydrated } from '@/shared/lib';
import { Button, RatingBadge, SectionHeader } from '@/ui-kit';

import s from './RecentPlayers.module.scss';

export const RecentPlayers = () => {
  const t = useTranslations('players.recent');
  const format = useFormatter();
  const isHydrated = useHydrated();
  const { players, clear } = useRecentPlayers();

  if (!isHydrated || players.length === 0) {
    return null;
  }

  return (
    <section>
      <SectionHeader
        action={
          <Button size='sm' variant='ghost' onClick={clear}>
            <X size={14} />
            {t('clear')}
          </Button>
        }
        eyebrow={t('eyebrow')}
        index='// 01'
        title={t('title')}
      />
      <motion.ul animate='visible' className={s.grid} initial='hidden' variants={STAGGER}>
        {players.map(({ accountId, nickname, clanTag, wn8 }) => (
          <motion.li key={accountId} variants={STAGGER_ITEM}>
            <Link className={s.card} href={ROUTES.player(nickname)}>
              <History aria-hidden className={s.icon} size={14} />
              <PlayerIdentity player={{ nickname, clanTag }} />
              {wn8 !== null && (
                <RatingBadge
                  className={s.badge}
                  size='sm'
                  tone={toneOfTier(ratingTier({ scale: 'wn8', value: wn8 }))}
                  value={format.number(wn8)}
                  withPips={false}
                />
              )}
            </Link>
          </motion.li>
        ))}
      </motion.ul>
    </section>
  );
};
