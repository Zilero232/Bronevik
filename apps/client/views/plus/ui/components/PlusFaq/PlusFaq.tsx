'use client';

import { ChevronDown } from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';

import { REVEAL_VIEWPORT, STAGGER, STAGGER_ITEM } from '@/shared/lib';
import { SectionHeader } from '@/ui-kit';

import { PLUS_FAQ } from '../../../config';

import s from './PlusFaq.module.scss';

export const PlusFaq = () => {
  const t = useTranslations('plus.faq');

  return (
    <section className={s.root}>
      <SectionHeader eyebrow={t('eyebrow')} index='03' title={t('title')} />
      <motion.div className={s.list} initial='hidden' variants={STAGGER} viewport={REVEAL_VIEWPORT} whileInView='visible'>
        {PLUS_FAQ.map((id) => (
          <motion.details key={id} className={s.item} variants={STAGGER_ITEM}>
            <summary className={s.question}>
              {t(`items.${id}.question`)}
              <ChevronDown aria-hidden className={s.chevron} size={18} />
            </summary>
            <p className={s.answer}>{t(`items.${id}.answer`)}</p>
          </motion.details>
        ))}
      </motion.div>
    </section>
  );
};
