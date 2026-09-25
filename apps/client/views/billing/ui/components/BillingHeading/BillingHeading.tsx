'use client';

import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';

import { STAGGER_ITEM } from '@/shared/lib';

import s from './BillingHeading.module.scss';

export const BillingHeading = () => {
  const t = useTranslations('billing.heading');

  return (
    <motion.header className={s.root} variants={STAGGER_ITEM}>
      <span className={s.eyebrow}>{t('eyebrow')}</span>
      <h1 className={s.title}>{t.rich('title', { gold: (chunks) => <span className={s.gold}>{chunks}</span> })}</h1>
      <p className={s.description}>{t('description')}</p>
    </motion.header>
  );
};
