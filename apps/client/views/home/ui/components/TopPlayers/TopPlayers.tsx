'use client';

import { ArrowRight } from 'lucide-react';
import { LayoutGroup, motion } from 'motion/react';
import { useTranslations } from 'next-intl';

import { PlayerCard } from '@/entities/player/player';
import { PeriodSwitcher } from '@/features/stats/select-period';
import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { SPRING } from '@/shared/lib';
import { buttonVariants, SectionHeader } from '@/ui-kit';

import { useTopPlayers } from '../../../model/hooks';

import s from './TopPlayers.module.scss';

export const TopPlayers = () => {
  const t = useTranslations('home.topPlayers');
  const { period, setPeriod, players } = useTopPlayers();

  return (
    <section>
      <SectionHeader
        action={<PeriodSwitcher value={period} onChange={setPeriod} />}
        description={t('description')}
        eyebrow={t('eyebrow')}
        index='// 02'
        title={t('title')}
      />
      <LayoutGroup>
        <div className={s.grid}>
          {players.map((player, index) => (
            <motion.div layout key={player.id} transition={SPRING}>
              <PlayerCard player={player} rank={index + 1} />
            </motion.div>
          ))}
        </div>
      </LayoutGroup>
      <div className={s.more}>
        <Link className={buttonVariants({ variant: 'secondary' })} href={ROUTES.top}>
          {t('all')}
          <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
};
