'use client';

import { parseISO } from 'date-fns';
import { useFormatter, useTranslations } from 'next-intl';

import { Badge, SectionHeader } from '@/ui-kit';

import { TANK_SECTIONS } from '../../../config';
import { useTank } from '../../../model/context';
import { RevealSection } from '../RevealSection';
import { SectionNotice } from '../SectionNotice';
import { MasteryThresholds, MoeHistory, MoeThresholds } from './components';

import s from './MarksSection.module.scss';

export const MarksSection = () => {
  const t = useTranslations('tank.marks');
  const format = useFormatter();
  const { detail } = useTank();

  const { moe } = detail;
  const updated = moe && <Badge tone='steel'>{t('updated', { date: format.dateTime(parseISO(moe.date), { dateStyle: 'medium' }) })}</Badge>;

  return (
    <RevealSection id={TANK_SECTIONS.marks}>
      <SectionHeader action={updated} description={t('description')} eyebrow={t('eyebrow')} index='// 02' title={t('title')} />
      {moe ? <MoeThresholds moe={moe} /> : <SectionNotice description={t('noMoeDescription')} kind='empty' title={t('noMoeTitle')} />}
      <div className={s.layout}>
        <MoeHistory />
        <MasteryThresholds />
      </div>
    </RevealSection>
  );
};
