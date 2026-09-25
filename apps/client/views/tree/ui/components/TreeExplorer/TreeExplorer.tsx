'use client';

import { TriangleAlert, Waypoints } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { match, P } from 'ts-pattern';

import { EmptyState } from '@/ui-kit';

import { useTechTree, useTreeParams } from '../../../model/hooks';
import { TreeSkeleton } from '../TreeSkeleton';
import { TreeWorkspace } from '../TreeWorkspace';

export const TreeExplorer = () => {
  const t = useTranslations('tree.states');
  const { nation } = useTreeParams();
  const { tree, premiums, layout, isLoading, isError, isEmpty } = useTechTree(nation);

  return match({ tree, layout, isLoading, isError, isEmpty })
    .with({ isLoading: true }, () => <TreeSkeleton />)
    .with({ isError: true }, () => <EmptyState description={t('errorDescription')} icon={<TriangleAlert size={28} />} title={t('errorTitle')} />)
    .with({ isEmpty: true }, () => <EmptyState description={t('emptyDescription')} icon={<Waypoints size={28} />} title={t('emptyTitle')} />)
    .with({ tree: P.nonNullable, layout: P.nonNullable }, ({ tree: loaded, layout: placed }) => (
      <TreeWorkspace layout={placed} premiums={premiums} tree={loaded} />
    ))
    .otherwise(() => <TreeSkeleton />);
};
