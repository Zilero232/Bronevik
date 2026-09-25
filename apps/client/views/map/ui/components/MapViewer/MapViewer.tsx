'use client';

import { ImageOff } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { useMapLabels } from '@/entities/map/map';

import type { MapViewerProps } from './MapViewer.types';

import { MAP_GRID, MAP_VIEW } from '../../../config';
import { useMapCursor } from '../../../model/hooks';
import { HudOverlay } from './components';

import s from './MapViewer.module.scss';

export const MapViewer = ({ image, name, size, mode }: MapViewerProps) => {
  const t = useTranslations('maps');
  const labels = useMapLabels();
  const { square, onPointerMove, onPointerLeave } = useMapCursor();
  const [failed, setFailed] = useState<string | null>(null);

  const isBroken = image === null || failed === image;

  return (
    <figure className={s.root}>
      <span aria-hidden className={s.corner} />
      <span aria-hidden className={s.columns}>
        {MAP_GRID.columns.map((column, index) => (
          <span key={column} data-active={square?.column === index}>
            {column}
          </span>
        ))}
      </span>
      <span aria-hidden className={s.rows}>
        {MAP_GRID.rows.map((row, index) => (
          <span key={row} data-active={square?.row === index}>
            {row}
          </span>
        ))}
      </span>
      <div className={s.stage} onPointerLeave={onPointerLeave} onPointerMove={onPointerMove}>
        <AnimatePresence initial={false}>
          {image && (
            <motion.img
              key={image}
              alt={t('map.minimapAlt', { name, mode: mode ? labels.mode(mode) : '—' })}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              className={s.image}
              exit={{ opacity: 0 }}
              height={MAP_VIEW.imageSize}
              initial={{ opacity: 0, scale: 1.03, filter: 'blur(4px)' }}
              src={image}
              transition={{ duration: MAP_VIEW.crossfadeSec }}
              width={MAP_VIEW.imageSize}
              onError={() => setFailed(image)}
            />
          )}
        </AnimatePresence>
        {isBroken && (
          <span className={s.broken}>
            <ImageOff aria-hidden size={28} />
            {t('map.imageMissing')}
          </span>
        )}
        <HudOverlay size={size} square={square} />
      </div>
      <figcaption className={s.caption}>{t('map.gridHint')}</figcaption>
    </figure>
  );
};
