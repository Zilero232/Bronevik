'use client';

import { useTranslations } from 'next-intl';

import { SweatBadge } from '@/entities/tank/tank';
import { Card, CardHeader } from '@/ui-kit';

import { TANK_SECTIONS } from '../../../config';
import { useTank } from '../../../model/context';
import { MoeHistory, MoeStrip } from './components';

import s from './MarksSection.module.scss';

export const MarksSection = () => {
  const t = useTranslations('tank.marks');
  const { detail } = useTank();

  return (
    <Card className={s.root} id={TANK_SECTIONS.marks} padding='none'>
      <CardHeader
        action={detail.sweat.moeLevel ? <SweatBadge level={detail.sweat.moeLevel} ratio={detail.sweat.moe} /> : null}
        className={s.header}
        title={t('title')}
      />
      <MoeStrip />
      <MoeHistory />
    </Card>
  );
};
