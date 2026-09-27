'use client';

import { useTranslations } from 'next-intl';

import type { MetricPlateProps } from './MetricPlate.types';

import { OverlayValue } from '../OverlayValue';
import { Plate } from '../Plate';

import s from './MetricPlate.module.scss';

export const MetricPlate = ({ reading, animate }: MetricPlateProps) => {
  const t = useTranslations('overlay.metric');
  const { metric, value, kind, tone } = reading;

  return (
    <Plate label={t(metric)}>
      <span className={s.value} data-tone={tone ?? undefined}>
        <OverlayValue animate={animate} kind={kind} value={value} />
      </span>
    </Plate>
  );
};
