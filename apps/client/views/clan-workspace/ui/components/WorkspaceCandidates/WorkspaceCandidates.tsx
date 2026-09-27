'use client';

import { useTranslations } from 'next-intl';

import { DataTable, EmptyState, QueryState, SectionHeader, SegmentedControl, Skeleton } from '@/ui-kit';

import type { WorkspaceCandidatesProps } from './WorkspaceCandidates.types';

import { WORKSPACE_VIEW } from '../../../config';
import { useCandidateColumns, useWorkspaceCandidates } from '../../../model/hooks';
import { AddCandidate, CandidateCard } from './components';

import s from './WorkspaceCandidates.module.scss';

export const WorkspaceCandidates = ({ clanId }: WorkspaceCandidatesProps) => {
  const t = useTranslations('clanWorkspace');
  const columns = useCandidateColumns({ clanId });
  const { query, filter, filters, candidates, onFilterChange } = useWorkspaceCandidates({ clanId, isEnabled: true });

  return (
    <div className={s.root}>
      <SectionHeader
        action={<AddCandidate clanId={clanId} />}
        count={candidates.length}
        id='workspace-candidates'
        meta={t('recruits.meta')}
        title={t('recruits.title')}
      />
      <SegmentedControl
        aria-label={t('recruits.filter')}
        className={s.filter}
        options={filters.map((value) => ({ value, label: value === 'all' ? t('recruits.all') : t(`candidates.${value}`) }))}
        size='sm'
        value={filter}
        onChange={onFilterChange}
      />
      <QueryState
        empty={
          <EmptyState description={t('recruits.emptyDescription')} title={filter === 'all' ? t('recruits.empty') : t('recruits.emptyFiltered')} />
        }
        errorTitle={t('recruits.error')}
        isEmpty={(rows) => rows.length === 0}
        query={query}
        skeleton={<Skeleton height={WORKSPACE_VIEW.skeletonHeight} shape='block' />}
      >
        {(rows) => (
          <DataTable
            caption={t('recruits.caption')}
            columns={columns}
            data={rows}
            density='compact'
            getRowId={(row) => row.id}
            renderCard={(row) => <CandidateCard candidate={row} clanId={clanId} />}
          />
        )}
      </QueryState>
    </div>
  );
};
