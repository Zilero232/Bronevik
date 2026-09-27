import { EmptyState } from '@/ui-kit';

import type { CodeListProps } from './CodeList.types';

import { CodeCard } from '../CodeCard';

import s from './CodeList.module.scss';

export const CodeList = ({ codes, emptyTitle }: CodeListProps) => {
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
