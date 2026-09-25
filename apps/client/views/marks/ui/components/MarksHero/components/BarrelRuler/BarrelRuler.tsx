'use client';

import { AnimatedMarkOfExcellence } from '@bronevik/icons';
import { MOE } from '@bronevik/ratings';
import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';

import { RULER_MARKS, RULER_TICKS } from './BarrelRuler.constants';
import { RULER_FILL, RULER_PIN } from './BarrelRuler.motion';

import s from './BarrelRuler.module.scss';

export const BarrelRuler = () => {
  const t = useTranslations('marks.hero.ruler');

  return (
    <figure aria-label={t('label')} className={s.root}>
      <div className={s.pins}>
        {RULER_MARKS.map((marks, index) => (
          <motion.div
            key={marks}
            animate='visible'
            className={s.pin}
            custom={index}
            initial='hidden'
            style={{ left: `${MOE.markPercents[index]}%` }}
            variants={RULER_PIN}
          >
            <AnimatedMarkOfExcellence
              className={s.icon}
              marks={marks}
              size={40}
              strokeWidth={1.4}
              title={t('mark', { marks, percent: MOE.markPercents[index] })}
            />
            <span className={s.pinLabel}>{MOE.markPercents[index]}%</span>
          </motion.div>
        ))}
      </div>
      <div className={s.track}>
        <motion.span animate='visible' className={s.fill} initial='hidden' style={{ width: `${MOE.markPercents[2]}%` }} variants={RULER_FILL} />
        {RULER_TICKS.map((tick) => (
          <span key={tick} className={s.tick} data-major={tick % 25 === 0} style={{ left: `${tick}%` }} />
        ))}
      </div>
      <div aria-hidden className={s.scale}>
        <span>0%</span>
        <span>50%</span>
        <span>100%</span>
      </div>
      <figcaption className={s.caption}>{t('caption')}</figcaption>
    </figure>
  );
};
