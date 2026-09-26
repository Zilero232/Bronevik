'use client';

import { useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import { DataTable, EmptyState } from '@/ui-kit';

import type { ClanRosterProps } from './ClanRoster.types';

import { useRoster, useRosterColumns } from '../../../model/hooks';
import { ActivityStrip, RosterFilters } from './components';

import s from './ClanRoster.module.scss';

export const ClanRoster = ({ members, now }: ClanRosterProps) => {
  const t = useTranslations('clans.roster');
  const { role, idle, rows, total, distribution, shares, isFiltered, setFilters, reset } = useRoster({ members, now });
  const columns = useRosterColumns();

  return (
    <div className={s.root}>
      <ActivityStrip distribution={distribution} shares={shares} />
      <RosterFilters
        idle={idle}
        isFiltered={isFiltered}
        role={role}
        onIdleChange={(next) => void setFilters({ idle: next })}
        onReset={() => void reset()}
        onRoleChange={(next) => void setFilters({ role: next })}
      />
      <DataTable
        columns={columns}
        data={rows}
        emptyState={<EmptyState isCompact description={t('emptyDescription')} title={t('emptyTitle')} />}
        getRowId={({ accountId }) => String(accountId)}
        getRowLink={({ nickname }) => ({ href: ROUTES.players.profile(nickname), label: nickname })}
        summary={t('shown', { shown: rows.length, total })}
      />
    </div>
  );
};
