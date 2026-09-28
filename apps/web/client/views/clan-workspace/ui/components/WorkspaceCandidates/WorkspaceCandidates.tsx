'use client';

import { useTranslations } from 'next-intl';

import { DataTable, FilteredEmptyState, QueryState, SectionHeader, SegmentedControl, Select, Skeleton } from '@/ui-kit';

import type { WorkspaceCandidatesProps } from './WorkspaceCandidates.types';

import { WORKSPACE_VIEW } from '../../../config';
import { useWorkspaceCandidates } from '../../../model/hooks';
import { useCandidateColumns } from '../../../model/hooks/use-candidate-columns';
import { AddCandidate, CandidateCard } from './components';

import s from './WorkspaceCandidates.module.scss';

export const WorkspaceCandidates = ({ clanId }: WorkspaceCandidatesProps) => {
  const t = useTranslations('clanWorkspace');
  const columns = useCandidateColumns({ clanId });
  const { query, filter, filterOptions, isFiltered, candidates, onFilterChange, onFilterReset } = useWorkspaceCandidates({ clanId, isEnabled: true });

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
        options={filterOptions}
        size='sm'
        value={filter}
        onChange={onFilterChange}
      />
      <Select aria-label={t('recruits.filter')} className={s.filterSelect} items={filterOptions} value={filter} onValueChange={onFilterChange} />
      <QueryState
        empty={
          <FilteredEmptyState
            description={t('recruits.emptyDescription')}
            isFiltered={isFiltered}
            title={isFiltered ? t('recruits.emptyFiltered') : t('recruits.empty')}
            onReset={onFilterReset}
          />
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
