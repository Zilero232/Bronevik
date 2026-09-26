'use client';

import { useFormatter, useTranslations } from 'next-intl';
import { useId } from 'react';

import { Card, CardHeader, DataTable, EmptyState } from '@/ui-kit';

import type { ReplayScoreboardProps } from './ReplayScoreboard.types';

import { useReplayScoreboard } from '../../../model/hooks';

import s from './ReplayScoreboard.module.scss';

export const ReplayScoreboard = ({ replay }: ReplayScoreboardProps) => {
  const t = useTranslations('replays.scoreboard');
  const format = useFormatter();
  const titleId = useId();
  const { columns, teams } = useReplayScoreboard(replay);

  return (
    <div className={s.root}>
      {teams.map((team) => (
        <Card key={team.id} aria-labelledby={`${titleId}-${team.id}`} data-team={team.id} padding='none'>
          <CardHeader
            meta={t('totals', {
              alive: team.totals.alive,
              players: team.totals.players,
              damage: format.number(team.totals.damageDealt),
              frags: team.totals.frags
            })}
            title={<span id={`${titleId}-${team.id}`}>{t(`teams.${team.id}`)}</span>}
          />
          <DataTable
            columns={columns}
            data={[...team.players]}
            density='compact'
            emptyState={<EmptyState isCompact title={t('empty')} />}
            getRowId={(row) => `${row.accountId}-${row.vehicleId ?? row.tankId}`}
          />
        </Card>
      ))}
      <p className={s.note}>{t('note')}</p>
    </div>
  );
};
