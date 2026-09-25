'use client';

import { AnimatedMarkOfExcellence } from '@bronevik/icons';
import { Flame } from 'lucide-react';
import { useFormatter, useTranslations } from 'next-intl';
import { useState } from 'react';
import { toast } from 'sonner';

import { Burst, Button, Card, ProgressRing, SectionHeader } from '@/ui-kit';

import { MARKS_DEMO } from './MarksShowcase.constants';

import s from './MarksShowcase.module.scss';

export const MarksShowcase = () => {
  const t = useTranslations('home.marks');
  const format = useFormatter();
  const [ignition, setIgnition] = useState(0);

  const onIgnite = () => {
    setIgnition((current) => current + 1);
    toast.success(t('toastTitle'), { description: t('toastBody', { tank: MARKS_DEMO.tank }) });
  };

  return (
    <section>
      <SectionHeader description={t('description')} eyebrow={t('eyebrow')} index='// 04' title={t('title')} />
      <div className={s.layout}>
        <Card padding='lg'>
          <div className={s.progress}>
            <ProgressRing label={t('progressLabel')} size={176} thickness={10} tone='unicum' value={MARKS_DEMO.progress}>
              <span className={s.percent}>{format.number(MARKS_DEMO.progress, { maximumFractionDigits: 1 })}%</span>
              <span className={s.caption}>{t('toThird')}</span>
            </ProgressRing>
            <div className={s.details}>
              <span className={s.tank}>{MARKS_DEMO.tank}</span>
              <p className={s.need}>{t('need', { damage: format.number(MARKS_DEMO.damageNeeded) })}</p>
              <Burst trigger={ignition}>
                <Button onClick={onIgnite}>
                  <Flame size={16} />
                  {t('ignite')}
                </Button>
              </Burst>
            </div>
          </div>
        </Card>
        <div className={s.marks}>
          {MARKS_DEMO.levels.map((level) => (
            <Card key={`${level.marks}-${ignition}`} className={s.mark} padding='md' variant='sunken'>
              <AnimatedMarkOfExcellence className={s.markIcon} marks={level.marks} size={72} strokeWidth={1.25} />
              <span className={s.markTitle}>{t(`levels.${level.marks}`)}</span>
              <span className={s.markThreshold}>{t('threshold', { percent: level.percent })}</span>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
