'use client';

import { Mark3Icon, RandomBattleIcon, SpottingIcon } from '@bronevik/icons';
import { Users } from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';

import { REVEAL_VIEWPORT, STAGGER, STAGGER_ITEM } from '@/shared/lib';
import { MOCK_SERVER } from '@/shared/mocks';
import { StatTile } from '@/ui-kit';

import { useLiveCounters } from '../../../model/hooks';

import s from './LiveCounters.module.scss';

const BATTLE_TREND = MOCK_SERVER.battlesSeries.map((point) => point.value);

export const LiveCounters = () => {
  const t = useTranslations('home.counters');
  const counters = useLiveCounters();

  const tiles = [
    { key: 'battles', value: counters.battlesTracked, icon: <RandomBattleIcon size={18} />, trend: BATTLE_TREND, tone: 'accent' },
    { key: 'players', value: counters.playersTracked, icon: <Users size={18} />, tone: 'steel' },
    { key: 'today', value: counters.playersToday, icon: <SpottingIcon size={18} />, tone: 'good' },
    { key: 'marks', value: counters.marksTracked, icon: <Mark3Icon size={18} />, tone: 'unicum' }
  ] as const;

  return (
    <motion.section aria-label={t('label')} className={s.root} initial='hidden' variants={STAGGER} viewport={REVEAL_VIEWPORT} whileInView='visible'>
      {tiles.map((tile) => (
        <motion.div key={tile.key} variants={STAGGER_ITEM}>
          <StatTile
            hint={t(`${tile.key}Hint`)}
            icon={tile.icon}
            label={t(tile.key)}
            tone={tile.tone}
            trend={'trend' in tile ? [...tile.trend] : undefined}
            value={tile.value}
          />
        </motion.div>
      ))}
    </motion.section>
  );
};
