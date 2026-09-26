'use client';

import { useTranslations } from 'next-intl';

import { Card, CardHeader } from '@/ui-kit';

import { TANK_SECTIONS } from '../../../config';
import { MoeHistory, MoeStrip } from './components';

import s from './MarksSection.module.scss';

export const MarksSection = () => {
  const t = useTranslations('tank.marks');

  return (
    <Card className={s.root} id={TANK_SECTIONS.marks} padding='none'>
      <CardHeader className={s.header} title={t('title')} />
      <MoeStrip />
      <MoeHistory />
    </Card>
  );
};
