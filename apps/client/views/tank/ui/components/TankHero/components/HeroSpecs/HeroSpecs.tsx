'use client';

import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';

import { KEY_SPECS, specsOfStats, TANK_SPECS, useSpecFormat } from '@/entities/tank/tank';
import { STAGGER_ITEM } from '@/shared/lib';
import { AnimatedNumber } from '@/ui-kit';

import { useTank } from '../../../../../model/context';
import { SPECS_LIST } from './HeroSpecs.motion';

import s from './HeroSpecs.module.scss';

export const HeroSpecs = () => {
  const t = useTranslations('tank.hero');
  const { label, unit } = useSpecFormat();
  const { detail } = useTank();

  const specs = specsOfStats(detail.stats.top ?? detail.stats.stock);

  return (
    <aside aria-labelledby='tank-key-specs' className={s.root}>
      <header className={s.head}>
        <h2 className={s.title} id='tank-key-specs'>
          {t('keySpecs')}
        </h2>
        <span className={s.code}>{t('specsCode')}</span>
      </header>
      <motion.dl animate='visible' className={s.list} initial='hidden' variants={SPECS_LIST}>
        {KEY_SPECS.map((key) => {
          const value = specs[key];
          const digits = TANK_SPECS[key].digits;
          const suffix = unit(key);

          return (
            <motion.div key={key} className={s.row} variants={STAGGER_ITEM}>
              <dt className={s.label}>{label(key)}</dt>
              <dd className={s.value}>
                {value === null || value === undefined ? (
                  '—'
                ) : (
                  <AnimatedNumber format={{ maximumFractionDigits: digits, minimumFractionDigits: Math.min(digits, 1) }} value={value} />
                )}
                {suffix && <span className={s.unit}>{suffix}</span>}
              </dd>
            </motion.div>
          );
        })}
      </motion.dl>
    </aside>
  );
};
