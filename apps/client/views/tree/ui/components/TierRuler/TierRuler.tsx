import { toRoman } from '@otmetki/icons';
import { useTranslations } from 'next-intl';

import type { TierRulerProps } from './TierRuler.types';

import { TREE_LAYOUT } from '../../../config';
import { tierColumnX } from '../../../lib/tree-layout';

import s from './TierRuler.module.scss';

export const TierRuler = ({ tiers, height }: TierRulerProps) => {
  const t = useTranslations('tree.canvas');

  return (
    <div aria-hidden className={s.root}>
      {tiers.map((tier) => (
        <div
          key={tier}
          style={{
            left: tierColumnX(tier),
            top: -TREE_LAYOUT.rulerOffset,
            width: TREE_LAYOUT.nodeWidth,
            height: height + TREE_LAYOUT.rulerOffset * 2
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
