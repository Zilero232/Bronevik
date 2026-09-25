'use client';

import { apiPlanSchema } from '@bronevik/schemas';
import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';

import { REVEAL_VIEWPORT, STAGGER } from '@/shared/lib';
import { SectionHeader } from '@/ui-kit';

import { useCurrentPlan } from '../../../model/hooks';
import { PlanCard } from './components';

import s from './PlanCards.module.scss';

export const PlanCards = () => {
  const t = useTranslations('developers.plans');
  const currentPlan = useCurrentPlan();

  return (
    <section className={s.root} id='plans'>
      <SectionHeader description={t('description')} eyebrow={t('eyebrow')} index='01' title={t('title')} />
      <motion.ul className={s.grid} initial='hidden' variants={STAGGER} viewport={REVEAL_VIEWPORT} whileInView='visible'>
        {apiPlanSchema.options.map((plan) => (
          <PlanCard key={plan} isCurrent={plan === currentPlan} plan={plan} />
        ))}
      </motion.ul>
      <p className={s.legal}>{t('legal')}</p>
    </section>
  );
};
