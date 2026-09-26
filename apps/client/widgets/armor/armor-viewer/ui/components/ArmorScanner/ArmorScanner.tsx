'use client';

import { motion, useReducedMotion } from 'motion/react';
import { useTranslations } from 'next-intl';

import { SCANNER_SWEEP } from './ArmorScanner.motion';

import s from './ArmorScanner.module.scss';

export const ArmorScanner = () => {
  const t = useTranslations('armor.states');
  const reducedMotion = useReducedMotion();

  return (
    <div aria-busy className={s.root} role='status'>
      <span aria-hidden className={s.reticle} />
      {!reducedMotion && <motion.span aria-hidden className={s.sweep} {...SCANNER_SWEEP} />}
      <span className={s.label}>{t('loading')}</span>
    </div>
  );
};
