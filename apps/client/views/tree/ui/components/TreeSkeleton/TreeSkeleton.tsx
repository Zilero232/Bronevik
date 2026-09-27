import { useTranslations } from 'next-intl';
import { range } from 'remeda';

import { Skeleton } from '@/ui-kit';

import { TREE_LAYOUT } from '../../../config';

import s from './TreeSkeleton.module.scss';

export const TreeSkeleton = () => {
  const t = useTranslations('tree.states');

  return (
    <div aria-busy aria-label={t('loading')} className={s.root} role='status'>
      {range(1, TREE_LAYOUT.skeletonColumns + 1).map((column) => (
        <div key={column} className={s.column}>
          <Skeleton height={12} shape='line' width={24} />
          <Skeleton count={1 + (column % 4)} height={56} width='100%' />
        </div>
      ))}
    </div>
  );
};
