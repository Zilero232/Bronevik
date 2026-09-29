'use client';

import { useTranslations } from 'next-intl';

import { SweatBadge } from '@/entities/tank/tank';

import { TANK_SECTIONS } from '../../../config';
import { useTank } from '../../../model/context';
import { TankSection } from '../TankSection';
import { MoeHistory, MoeStrip } from './components';

export const MarksSection = () => {
  const t = useTranslations('tank.marks');
  const { detail } = useTank();

  return (
    <TankSection
      action={detail.sweat.moeLevel ? <SweatBadge level={detail.sweat.moeLevel} ratio={detail.sweat.moe} /> : null}
      id={TANK_SECTIONS.marks}
      title={t('title')}
    >
      <MoeStrip />
      <MoeHistory />
    </TankSection>
  );
};
