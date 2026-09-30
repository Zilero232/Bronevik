'use client';

import * as m from 'motion/react-m';
import { useTranslations } from 'next-intl';

import { SectionHeader } from '@/ui-kit';

import { FLOW_STEPS, LANDING_ANCHORS } from '../../../config';
import { FLOW_TRACER } from './FlowSection.motion';

import s from './FlowSection.module.scss';

export const FlowSection = () => {
  const t = useTranslations('streamers.flow');

  return (
    <section className={s.root} id={LANDING_ANCHORS.flow}>
      <SectionHeader description={t('description')} title={t('title')} />
      <ol className={s.steps}>
        <m.span
          aria-hidden
          className={s.tracer}
          initial='hidden'
          variants={FLOW_TRACER.variants}
          viewport={FLOW_TRACER.viewport}
          whileInView='visible'
        />
        {FLOW_STEPS.map((step, index) => (
          <li key={step} className={s.step} data-step={step}>
            <span className={s.index}>{String(index + 1).padStart(2, '0')}</span>
            <h3 className={s.title}>{t(`steps.${step}.title`)}</h3>
            <p className={s.text}>{t(`steps.${step}.text`)}</p>
            <p className={s.sample}>{t(`steps.${step}.sample`)}</p>
          </li>
        ))}
      </ol>
    </section>
  );
};
