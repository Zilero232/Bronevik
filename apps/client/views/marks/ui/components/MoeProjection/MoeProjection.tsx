'use client';

import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';

import { REVEAL_VIEWPORT, SLIDE_UP } from '@/shared/lib';
import { Card, SectionHeader } from '@/ui-kit';

import { useMoeProjection } from '../../../model/hooks';
import { ProjectionChart, ProjectionForm, ProjectionResult } from './components';

import s from './MoeProjection.module.scss';

export const MoeProjection = () => {
  const t = useTranslations('marks.projection');
  const { inputs, setters, threshold, targetPercent, targetDamage, battles, hasResult, isLoading, isRefreshing, curve } = useMoeProjection();

  return (
    <section className={s.root} id='projection'>
      <SectionHeader description={t('description')} eyebrow={t('eyebrow')} index='// 03' title={t('title')} />
      <motion.div className={s.layout} initial='hidden' variants={SLIDE_UP} viewport={REVEAL_VIEWPORT} whileInView='visible'>
        <Card className={s.form} padding='lg'>
          <ProjectionForm
            inputs={inputs}
            threshold={threshold}
            onDamageChange={setters.setDamage}
            onMarksChange={setters.setMarks}
            onPercentChange={setters.setPercent}
            onVehicleChange={setters.setVehicle}
          />
        </Card>
        <Card className={s.output} data-refreshing={isRefreshing} padding='lg' variant='sunken'>
          <ProjectionResult
            battles={battles}
            hasResult={hasResult}
            hasVehicle={inputs.vehicle !== null}
            isLoading={isLoading}
            marks={inputs.marks}
            targetDamage={targetDamage}
          />
          {curve.length > 1 && <ProjectionChart curve={curve} targetPercent={targetPercent} />}
        </Card>
      </motion.div>
    </section>
  );
};
