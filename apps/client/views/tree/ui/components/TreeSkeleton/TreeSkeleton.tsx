import { useTranslations } from 'next-intl';

import { Skeleton } from '@/ui-kit';

import s from './TreeSkeleton.module.scss';

const COLUMNS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export const TreeSkeleton = () => {
  const t = useTranslations('tree.states');

  return (
    <div aria-busy aria-label={t('loading')} className={s.root} role='status'>
      {COLUMNS.map((column) => (
        <div key={column} className={s.column}>
          <Skeleton height={12} shape='line' width={24} />
          {Array.from({ length: 1 + (column % 4) }, (_, row) => (
            <Skeleton key={row} height={56} width='100%' />
          ))}
        </div>
      ))}
    </div>
  );
};
