'use client';

import { toRoman } from '@otmetki/icons';
import { useTranslations } from 'next-intl';

import { TREE_LAYOUT } from '../../../config';
import { tierColumnX } from '../../../lib/tree-layout';
import { useTree } from '../../../model/context';

import s from './TierRuler.module.scss';

export const TierRuler = () => {
  const t = useTranslations('tree.canvas');
  const { layout } = useTree();

  return (
    <div aria-hidden className={s.root}>
      {layout.tiers.map((tier) => (
        <div
          key={tier}
          style={{
            left: tierColumnX(tier),
            top: -TREE_LAYOUT.rulerOffset,
            width: TREE_LAYOUT.nodeWidth,
            height: layout.height + TREE_LAYOUT.rulerOffset * 2
          }}
          className={s.column}
          title={t('tier', { tier })}
        >
          <span className={s.label}>{toRoman(tier)}</span>
        </div>
      ))}
    </div>
  );
};
