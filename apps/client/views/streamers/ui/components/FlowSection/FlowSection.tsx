'use client';

import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';

import { REVEAL_VIEWPORT, STAGGER, STAGGER_ITEM, stencilIndex } from '@/shared/lib';
import { SectionHeader } from '@/ui-kit';

import { FLOW_STEPS, LANDING_ANCHORS } from '../../../config';
import { FLOW_TRACER } from './FlowSection.motion';

import s from './FlowSection.module.scss';

export const FlowSection = () => {
  const t = useTranslations('streamers.flow');

  return (
    <section className={s.root} id={LANDING_ANCHORS.flow}>
      <SectionHeader description={t('description')} eyebrow={t('eyebrow')} index='02' title={t('title')} />
      <motion.ol className={s.steps} initial='hidden' variants={STAGGER} viewport={REVEAL_VIEWPORT} whileInView='visible'>
        <motion.span aria-hidden className={s.tracer} variants={FLOW_TRACER} />
        {FLOW_STEPS.map((step, index) => (
          <motion.li key={step} className={s.step} data-step={step} variants={STAGGER_ITEM}>
            <span className={s.index}>{stencilIndex(String(index + 1).padStart(2, '0'))}</span>
            <h3 className={s.title}>{t(`steps.${step}.title`)}</h3>
            <p className={s.text}>{t(`steps.${step}.text`)}</p>
            <p className={s.sample}>{t(`steps.${step}.sample`)}</p>
          </motion.li>
        ))}
      </motion.ol>
    </section>
  );
};
