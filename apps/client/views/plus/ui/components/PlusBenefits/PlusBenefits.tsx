'use client';

import { motion } from 'motion/react';
import { useFormatter, useTranslations } from 'next-intl';

import { REVEAL_VIEWPORT, STAGGER, STAGGER_ITEM } from '@/shared/lib';
import { SectionHeader } from '@/ui-kit';

import { PLUS_BENEFITS } from '../../../config';

import s from './PlusBenefits.module.scss';

export const PlusBenefits = () => {
  const t = useTranslations('plus.benefits');
  const format = useFormatter();

  return (
    <section className={s.root}>
      <SectionHeader description={t('description')} eyebrow={t('eyebrow')} index='01' title={t('title')} />
      <motion.ol className={s.grid} initial='hidden' variants={STAGGER} viewport={REVEAL_VIEWPORT} whileInView='visible'>
        {PLUS_BENEFITS.map(({ id, icon: Icon }, index) => (
          <motion.li key={id} className={s.item} variants={STAGGER_ITEM}>
            <span aria-hidden className={s.numeral}>
              {format.number(index + 1, { minimumIntegerDigits: 2 })}
            </span>
            <span aria-hidden className={s.icon}>
              <Icon size={22} strokeWidth={1.75} />
            </span>
            <h3 className={s.title}>{t(`items.${id}.title`)}</h3>
            <p className={s.text}>{t(`items.${id}.text`)}</p>
          </motion.li>
        ))}
      </motion.ol>
    </section>
  );
};
