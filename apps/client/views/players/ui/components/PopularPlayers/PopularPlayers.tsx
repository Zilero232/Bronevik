'use client';

import { ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { useFormatter, useTranslations } from 'next-intl';

import { PlayerIdentity } from '@/entities/player/player';
import { PLAYERS_REQUEST } from '@/shared/api/players';
import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { STAGGER, STAGGER_ITEM, toneOfTier } from '@/shared/lib';
import { buttonVariants, EmptyState, RatingBadge, SectionHeader, Skeleton } from '@/ui-kit';

import { usePopularPlayers } from '../../../model/hooks';

import s from './PopularPlayers.module.scss';

export const PopularPlayers = () => {
  const t = useTranslations('players.popular');
  const format = useFormatter();
  const { data: popular, isPending, isError } = usePopularPlayers();

  return (
    <section>
      <SectionHeader
        action={
          <Link className={buttonVariants({ variant: 'secondary', size: 'sm' })} href={ROUTES.top}>
            {t('all')}
            <ArrowRight size={14} />
          </Link>
        }
        description={t('description', { days: popular?.days ?? PLAYERS_REQUEST.popularDays })}
        eyebrow={t('eyebrow')}
        index='// 02'
        title={t('title')}
      />
      {isError && <EmptyState description={t('errorDescription')} title={t('errorTitle')} />}
      {isPending && (
        <div className={s.grid}>
          {Array.from({ length: PLAYERS_REQUEST.popularLimit }, (_, index) => (
            <Skeleton key={index} height={76} shape='block' />
          ))}
        </div>
      )}
      {popular?.items.length === 0 && <EmptyState description={t('emptyDescription')} title={t('emptyTitle')} />}
      {popular && popular.items.length > 0 && (
        <motion.ol animate='visible' className={s.grid} initial='hidden' variants={STAGGER}>
          {popular.items.map(({ accountId, nickname, clanTag, views, wn8 }, index) => (
            <motion.li key={accountId} variants={STAGGER_ITEM}>
              <Link className={s.card} href={ROUTES.player(nickname)}>
                <span className={s.rank}>{String(index + 1).padStart(2, '0')}</span>
                <span className={s.identity}>
                  <PlayerIdentity player={{ nickname, clanTag }} />
                  <span className={s.battles}>{t('views', { count: views })}</span>
                </span>
                <RatingBadge
                  label='WN8'
                  size='sm'
                  tone={wn8.tier ? toneOfTier(wn8.tier) : 'average'}
                  value={wn8.value === null ? '—' : format.number(wn8.value, { maximumFractionDigits: 0 })}
                />
              </Link>
            </motion.li>
          ))}
        </motion.ol>
      )}
    </section>
  );
};
