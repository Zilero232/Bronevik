'use client';

import { useTranslations } from 'next-intl';
import { match, P } from 'ts-pattern';

import { EmptyState, ErrorState } from '@/ui-kit';

import { useTechTree, useTreeParams } from '../../../model/hooks';
import { TreeSkeleton } from '../TreeSkeleton';
import { TreeWorkspace } from '../TreeWorkspace';

export const TreeExplorer = () => {
  const t = useTranslations('tree.states');
  const { nation } = useTreeParams();
  const { tree, premiums, layout, isLoading, isFetching, isError, isEmpty, refetch } = useTechTree(nation);

  return match({ tree, layout, isLoading, isError, isEmpty })
    .with({ isLoading: true }, () => <TreeSkeleton />)
    .with({ isError: true }, () => <ErrorState isRetrying={isFetching} title={t('errorTitle')} onRetry={refetch} />)
    .with({ isEmpty: true }, () => <EmptyState isCompact title={t('emptyTitle')} />)
    .with({ tree: P.nonNullable, layout: P.nonNullable }, ({ tree: loaded, layout: placed }) => (
      <TreeWorkspace layout={placed} premiums={premiums} tree={loaded} />
    ))
    .otherwise(() => <TreeSkeleton />);
};
