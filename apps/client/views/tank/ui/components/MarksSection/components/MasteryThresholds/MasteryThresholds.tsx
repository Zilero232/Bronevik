'use client';

import { AnimatedMastery } from '@bronevik/icons';
import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';

import { REVEAL_VIEWPORT, ROW_ITEM } from '@/shared/lib';
import { AnimatedNumber, Card, CardHeader } from '@/ui-kit';

import { MASTERY_LEVELS } from '../../../../../config';
import { useTank } from '../../../../../model/context';
import { SectionNotice } from '../../../SectionNotice';

import s from './MasteryThresholds.module.scss';

export const MasteryThresholds = () => {
  const t = useTranslations('tank.marks');
  const { detail } = useTank();

  const { mastery } = detail;

  return (
    <Card className={s.root} padding='lg'>
      <CardHeader eyebrow={t('masteryEyebrow')} title={t('masteryTitle')} />
      {!mastery && <SectionNotice kind='empty' />}
      {mastery && (
        <ul className={s.list}>
          {MASTERY_LEVELS.map(({ key, level }, index) => (
            <motion.li
              key={key}
              className={s.row}
              custom={index}
              data-level={level}
              initial='hidden'
              variants={ROW_ITEM}
              viewport={REVEAL_VIEWPORT}
              whileInView='visible'
            >
              <AnimatedMastery aria-hidden tinted className={s.icon} level={level} size={36} />
              <span className={s.name}>{t(`mastery.${key}`)}</span>
              <span className={s.value}>
                <AnimatedNumber value={mastery[key]} />
                <span className={s.unit}>{t('xpUnit')}</span>
              </span>
            </motion.li>
          ))}
        </ul>
      )}
    </Card>
  );
};
