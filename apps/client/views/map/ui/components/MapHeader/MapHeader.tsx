'use client';

import { ArrowLeft, Clock, Ruler, Users } from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';

import { CAMOUFLAGE_TONE, isMapCamouflage, useMapLabels } from '@/entities/map/map';
import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { HEAD_REVEAL, STAGGER_ITEM } from '@/shared/lib';
import { Badge } from '@/ui-kit';

import type { MapHeaderProps } from './MapHeader.types';

import { splitDuration } from '../../../lib/battle-duration';

import s from './MapHeader.module.scss';

export const MapHeader = ({ map }: MapHeaderProps) => {
  const t = useTranslations('maps');
  const labels = useMapLabels();

  const { arenaId, name, sizeMeters, camouflage, maxPlayersInTeam, roundLengthSec } = map;

  return (
    <header className={s.root}>
      <motion.div className={s.top} variants={STAGGER_ITEM}>
        <Link className={s.back} href={ROUTES.maps}>
          <ArrowLeft aria-hidden size={14} />
          {t('map.back')}
        </Link>
        <span className={s.code}>{`// ${arenaId}`}</span>
      </motion.div>
      <motion.h1 className={s.title} variants={HEAD_REVEAL}>
        {name}
      </motion.h1>
      <motion.div className={s.meta} variants={STAGGER_ITEM}>
        {sizeMeters !== null && (
          <span className={s.chip}>
            <Ruler aria-hidden size={14} />
            {t('size', { size: sizeMeters })}
          </span>
        )}
        {camouflage && <Badge tone={isMapCamouflage(camouflage) ? CAMOUFLAGE_TONE[camouflage] : 'neutral'}>{labels.camouflage(camouflage)}</Badge>}
        {maxPlayersInTeam !== null && (
          <span className={s.chip}>
            <Users aria-hidden size={14} />
            {t('map.players', { count: maxPlayersInTeam })}
          </span>
        )}
        {roundLengthSec !== null && (
          <span className={s.chip}>
            <Clock aria-hidden size={14} />
            {t('map.roundLength', { minutes: splitDuration(roundLengthSec).minutes })}
          </span>
        )}
      </motion.div>
    </header>
  );
};
