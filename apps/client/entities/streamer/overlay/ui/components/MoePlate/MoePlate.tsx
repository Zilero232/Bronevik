'use client';

import { useTranslations } from 'next-intl';

import { ProgressRing } from '@/ui-kit';

import type { MoePlateProps } from './MoePlate.types';

import { OVERLAY_BOARD } from '../../../config';
import { OverlayValue } from '../OverlayValue';
import { Plate } from '../Plate';

import s from './MoePlate.module.scss';

export const MoePlate = ({ moe, scale, animate, showTank }: MoePlateProps) => {
  const t = useTranslations('overlay');
  const { tankName, marks, percent } = moe;

  return (
    <Plate
      aside={
        <ProgressRing
          label={t('metric.moePercent')}
          max={OVERLAY_BOARD.percentMax}
          size={Math.round(OVERLAY_BOARD.ringSize * scale)}
          thickness={OVERLAY_BOARD.ringThickness}
          value={percent}
        >
          <span className={s.marks}>{marks}</span>
        </ProgressRing>
      }
      label={t('moe.label', { count: marks })}
    >
      <OverlayValue animate={animate} kind='percent' value={percent} />
      {showTank && <span className={s.tank}>{tankName}</span>}
    </Plate>
  );
};
