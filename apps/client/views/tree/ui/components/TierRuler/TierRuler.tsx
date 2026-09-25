'use client';

import { toRoman } from '@bronevik/icons';
import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';

import { EASE_OUT } from '@/shared/lib';

import type { TierRulerProps } from './TierRuler.types';

import { TREE_LAYOUT, TREE_MOTION } from '../../../config';
import { tierColumnX } from '../../../lib/tree-layout';

import s from './TierRuler.module.scss';

export const TierRuler = ({ tiers, height }: TierRulerProps) => {
  const t = useTranslations('tree.canvas');

  return (
    <div aria-hidden className={s.root}>
      {tiers.map((tier, index) => (
        <motion.div
          key={tier}
          style={{
            left: tierColumnX(tier),
            top: -TREE_LAYOUT.rulerOffset,
            width: TREE_LAYOUT.nodeWidth,
            height: height + TREE_LAYOUT.rulerOffset * 2
          }}
          animate={{ opacity: 1, y: 0 }}
          className={s.column}
          data-odd={index % 2 === 1}
          initial={{ opacity: 0, y: -8 }}
          title={t('tier', { tier })}
          transition={{ duration: 0.4, ease: EASE_OUT, delay: index * TREE_MOTION.tierStep }}
        >
          <span className={s.label}>{toRoman(tier)}</span>
        </motion.div>
      ))}
    </div>
  );
};
