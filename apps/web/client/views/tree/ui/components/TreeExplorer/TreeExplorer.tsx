'use client';

import { useTranslations } from 'next-intl';

import { isNotFoundError } from '@/shared/api/source';
import { EmptyState, QueryState } from '@/ui-kit';

import { useTechTree } from '../../../model/hooks';
import { TreeProvider } from '../TreeProvider';
import { TreeSkeleton } from '../TreeSkeleton';
import { TreeWorkspace } from '../TreeWorkspace';

export const TreeExplorer = () => {
  const t = useTranslations('tree.states');
  const query = useTechTree();

  const empty = <EmptyState isCompact title={t('emptyTitle')} />;

  return (
    <QueryState
      empty={empty}
      errorState={isNotFoundError(query.error) ? empty : undefined}
      errorTitle={t('errorTitle')}
      isEmpty={({ tree, premiums }) => tree.nodes.length === 0 && premiums.length === 0}
      query={query}
      skeleton={<TreeSkeleton />}
    >
      {(view) => (
        <TreeProvider {...view}>
          <TreeWorkspace />
        </TreeProvider>
      )}
    </QueryState>
  );
};
