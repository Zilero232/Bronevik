'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useFormatter, useTranslations } from 'next-intl';

import { FADE, SPRING } from '@/shared/lib';

import type { HudOverlayProps } from './HudOverlay.types';

import { MAP_GRID } from '../../../../../config';
import { squareMeters } from '../../../../../lib/map-grid';

import s from './HudOverlay.module.scss';

const CELL = 100 / MAP_GRID.rows.length;

export const HudOverlay = ({ size, square }: HudOverlayProps) => {
  const t = useTranslations('maps.map');
  const format = useFormatter();

  return (
    <div className={s.root}>
      <span aria-hidden className={s.grid} />
      <AnimatePresence>
        {square && (
          <motion.span
            aria-hidden
            key='cell'
            animate={{ opacity: 1, left: `${square.column * CELL}%`, top: `${square.row * CELL}%` }}
            className={s.cell}
            exit={{ opacity: 0 }}
            initial={{ opacity: 0, left: `${square.column * CELL}%`, top: `${square.row * CELL}%` }}
            transition={SPRING}
          />
        )}
      </AnimatePresence>
      <span aria-label={t('north')} className={s.compass} role='img'>
        <svg aria-hidden height='28' viewBox='0 0 28 28' width='28'>
          <circle cx='14' cy='14' fill='none' r='12' stroke='currentColor' strokeOpacity='0.4' />
          <path d='M14 4 L18 16 L14 13.5 L10 16 Z' fill='currentColor' />
        </svg>
        <span>N</span>
      </span>
      {size !== null && (
        <span className={s.scale}>
          <span aria-hidden className={s.ruler} />
          {t('scale', { meters: format.number(squareMeters(size)) })}
        </span>
      )}
      <AnimatePresence>
        {square && (
          <motion.span key='readout' animate='visible' className={s.readout} exit='hidden' initial='hidden' variants={FADE}>
            {t('square', { square: square.label })}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
};
