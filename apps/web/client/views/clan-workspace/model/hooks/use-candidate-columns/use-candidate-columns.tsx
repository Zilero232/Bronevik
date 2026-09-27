'use client';

import { createColumnHelper } from '@tanstack/react-table';
import { useFormatter, useTranslations } from 'next-intl';

import type { TableColumn } from '@/ui-kit';

import { RatingValue, scaledRating } from '@/entities/player/stats';
import { WinRateCell } from '@/entities/tank/tank';
import { RelativeTime } from '@/ui-kit';

import type { WorkspaceCandidate, WorkspaceScope } from '../../../api';

import { CANDIDATE_STATUSES } from '../../../config';
import { candidateNickname } from '../../../lib/candidate-notes';
import { CandidateActions, CandidateName, CandidateStatusCell } from '../../../ui/components/WorkspaceCandidates/components';

const column = createColumnHelper<WorkspaceCandidate>();

export const useCandidateColumns = ({ clanId }: WorkspaceScope): TableColumn<WorkspaceCandidate>[] => {
  const t = useTranslations('clanWorkspace.recruits');
  const format = useFormatter();

  return [
    column.accessor((row) => candidateNickname(row) ?? String(row.accountId), {
      id: 'player',
      header: t('columns.player'),
      cell: (info) => <CandidateName candidate={info.row.original} />,
      meta: { width: '28%' }
    }),
    column.accessor((row) => CANDIDATE_STATUSES.indexOf(row.status), {
      id: 'status',
      header: t('columns.status'),
      cell: (info) => <CandidateStatusCell candidate={info.row.original} clanId={clanId} />
    }),
    column.accessor((row) => row.stats?.wn8 ?? -1, {
      id: 'wn8',
      header: t('columns.wn8'),
      cell: (info) => <RatingValue rating={scaledRating({ scale: 'wn8', value: info.row.original.stats?.wn8 ?? null })} />,
      meta: { align: 'end', isNumeric: true }
    }),
    column.accessor((row) => row.stats?.winRate ?? -1, {
      id: 'winRate',
      header: t('columns.winRate'),
      cell: (info) => <WinRateCell value={info.row.original.stats?.winRate ?? null} />,
      meta: { align: 'end', isNumeric: true, hideBelow: 'sm' }
    }),
    column.accessor((row) => row.stats?.battles ?? -1, {
      id: 'battles',
      header: t('columns.battles'),
      cell: (info) => (info.row.original.stats?.battles == null ? '—' : format.number(info.row.original.stats.battles)),
      meta: { align: 'end', isNumeric: true, hideBelow: 'md' }
    }),
    column.accessor((row) => new Date(row.updatedAt).getTime(), {
      id: 'updated',
      header: t('columns.updated'),
      cell: (info) => <RelativeTime value={info.row.original.updatedAt} />,
      meta: { align: 'end', hideBelow: 'lg' }
    }),
    column.display({
      id: 'actions',
      header: '',
      cell: (info) => <CandidateActions candidate={info.row.original} clanId={clanId} />,
      meta: { align: 'end', width: 120 }
    })
  ];
};
