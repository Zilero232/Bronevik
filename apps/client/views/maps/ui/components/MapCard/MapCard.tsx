'use client';

import { ImageOff } from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';

import { CAMOUFLAGE_TONE, isMapCamouflage, ModeIcon, useMapLabels } from '@/entities/map/map';
import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { STAGGER_ITEM } from '@/shared/lib';
import { Badge } from '@/ui-kit';

import type { MapCardProps } from './MapCard.types';

import { MAPS_VIEW } from '../../../config';
import { useTilt } from '../../../model/hooks';

import s from './MapCard.module.scss';

export const MapCard = ({ map }: MapCardProps) => {
  const t = useTranslations('maps');
  const labels = useMapLabels();
  const { rotateX, rotateY, onPointerMove, onPointerLeave } = useTilt();

  const { slug, name, image, sizeMeters, camouflage, modes } = map;

  return (
    <motion.li className={s.item} variants={STAGGER_ITEM}>
      <motion.div className={s.tilt} style={{ rotateX, rotateY }} onPointerLeave={onPointerLeave} onPointerMove={onPointerMove}>
        <Link className={s.card} href={ROUTES.map(slug)}>
          <span className={s.frame}>
            {image ? (
              <img
                alt={t('card.minimapAlt', { name })}
                className={s.image}
                decoding='async'
                height={MAPS_VIEW.thumbSize}
                loading='lazy'
                src={image}
                width={MAPS_VIEW.thumbSize}
              />
            ) : (
              <span className={s.placeholder}>
                <ImageOff aria-hidden size={28} />
                <span className={s.srOnly}>{t('map.imageMissing')}</span>
              </span>
            )}
            <span aria-hidden className={s.grid} />
            <span aria-hidden className={s.scan} />
            {sizeMeters !== null && <span className={s.size}>{t('size', { size: sizeMeters })}</span>}
          </span>
          <span className={s.info}>
            <span className={s.name}>{name}</span>
            <span className={s.meta}>
              {camouflage && (
                <Badge tone={isMapCamouflage(camouflage) ? CAMOUFLAGE_TONE[camouflage] : 'neutral'}>{labels.camouflage(camouflage)}</Badge>
              )}
              <span className={s.modes}>
                {modes.map((mode) => (
                  <span key={mode} className={s.mode} title={labels.mode(mode)}>
                    <ModeIcon mode={mode} size={14} />
                    <span className={s.srOnly}>{labels.mode(mode)}</span>
                  </span>
                ))}
              </span>
            </span>
          </span>
        </Link>
      </motion.div>
    </motion.li>
  );
};
