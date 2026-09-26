'use client';

import type { CompetitionTeam } from '@otmetki/schemas';
import type { ColumnDef } from '@tanstack/react-table';

import { createColumnHelper } from '@tanstack/react-table';
import { useFormatter, useTranslations } from 'next-intl';

import type { UseStandingsColumnsInput } from './use-standings-columns.types';

import { COMPETITION_PAGE } from '../../../config';
import { MembersCell, TeamCell } from '../../../ui/components/StandingsTable/components';

const column = createColumnHelper<CompetitionTeam>();

export const useStandingsColumns = ({ myTeamId, battlesPerPlayer }: UseStandingsColumnsInput): ColumnDef<CompetitionTeam, never>[] => {
  const t = useTranslations('competitions.standings');
  const format = useFormatter();

  return [
    column.accessor('rank', {
      header: '#',
      meta: { width: 48, align: 'end', isRank: true }
    }),
    column.accessor('name', {
      header: t('columns.team'),
      cell: (info) => <TeamCell isMine={info.row.original.id === myTeamId} name={info.getValue()} />
    }),
    column.display({
      id: 'members',
      header: t('columns.members'),
      cell: (info) => <MembersCell battlesPerPlayer={battlesPerPlayer} members={info.row.original.members} />,
      meta: { width: '40%', hideBelow: 'md' }
    }),
    column.accessor('battles', {
      header: t('columns.battles'),
      cell: (info) => format.number(info.getValue()),
      meta: { align: 'end', isNumeric: true, hideBelow: 'sm' }
    }),
    column.accessor('score', {
      header: t('columns.score'),
      cell: (info) => format.number(info.getValue(), COMPETITION_PAGE.scoreFormat),
      meta: { align: 'end', isNumeric: true, bar: { tone: 'accent' } }
    })
  ];
};
