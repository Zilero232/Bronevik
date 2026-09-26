import { EmptyState, Skeleton } from '@/ui-kit';

import type { CodeListProps } from './CodeList.types';

import { CODES } from '../../../config';
import { CodeCard } from '../CodeCard';

import s from './CodeList.module.scss';

export const CodeList = ({ codes, isPending, emptyTitle }: CodeListProps) => {
  if (isPending) {
    return (
      <div className={s.root}>
        {Array.from({ length: CODES.skeletons }, (_, index) => (
          <Skeleton key={index} height={132} shape='block' />
        ))}
      </div>
    );
  }

  if (codes.length === 0) {
    return <EmptyState isCompact title={emptyTitle} />;
  }

  return (
    <ul className={s.root}>
      {codes.map((code) => (
        <CodeCard key={code.code} code={code} />
      ))}
    </ul>
  );
};
