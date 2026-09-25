'use client';

import { motion } from 'motion/react';

import { STAGGER, STAGGER_ITEM } from '@/shared/lib';

import type { MapViewProps } from './MapView.types';

import { useMapMode } from '../../../model/hooks';
import { MapHeader } from '../MapHeader';
import { MapNav } from '../MapNav';
import { MapStats } from '../MapStats';
import { MapViewer } from '../MapViewer';
import { ModeSwitcher } from '../ModeSwitcher';

import s from './MapView.module.scss';

export const MapView = ({ map }: MapViewProps) => {
  const { mode, image, available, setMode } = useMapMode(map);

  const { arenaId, name, sizeMeters, stats } = map;

  return (
    <motion.div animate='visible' className={s.root} initial='hidden' variants={STAGGER}>
      <MapHeader map={map} />
      <div className={s.layout}>
        <motion.div className={s.main} variants={STAGGER_ITEM}>
          {mode && <ModeSwitcher available={available} mode={mode} onChange={setMode} />}
          <MapViewer image={image} mode={mode} name={name} size={sizeMeters} />
        </motion.div>
        <motion.aside className={s.side} variants={STAGGER_ITEM}>
          <MapStats stats={stats} />
          <MapNav arenaId={arenaId} />
        </motion.aside>
      </div>
    </motion.div>
  );
};
