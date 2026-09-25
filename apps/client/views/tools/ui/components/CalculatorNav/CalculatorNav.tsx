'use client';

import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';

import { STAGGER, STAGGER_ITEM } from '@/shared/lib';

import type { CalculatorId } from '../../../config';

import { CALC_PANEL_ID, CALCULATOR_IDS } from '../../../config';
import { useActiveCalculator } from '../../../model/hooks';
import { CALCULATOR_ICONS } from './CalculatorNav.constants';

import s from './CalculatorNav.module.scss';

export const CalculatorNav = () => {
  const t = useTranslations('tools');
  const [active, setActive] = useActiveCalculator();

  const onPick = (id: CalculatorId) => {
    setActive(id);
    document.getElementById(CALC_PANEL_ID)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <nav aria-label={t('nav')}>
      <motion.ul animate='visible' className={s.grid} initial='hidden' variants={STAGGER}>
        {CALCULATOR_IDS.map((id, index) => {
          const Icon = CALCULATOR_ICONS[id];

          return (
            <motion.li key={id} variants={STAGGER_ITEM}>
              <button aria-controls={CALC_PANEL_ID} aria-pressed={active === id} className={s.card} type='button' onClick={() => onPick(id)}>
                <span className={s.index}>{String(index + 1).padStart(2, '0')}</span>
                <Icon aria-hidden className={s.icon} size={26} strokeWidth={1.6} />
                <span className={s.title}>{t(`calcs.${id}.title`)}</span>
                <span className={s.blurb}>{t(`calcs.${id}.blurb`)}</span>
                {active === id && <motion.span className={s.marker} layoutId='calc-marker' />}
              </button>
            </motion.li>
          );
        })}
      </motion.ul>
    </nav>
  );
};
