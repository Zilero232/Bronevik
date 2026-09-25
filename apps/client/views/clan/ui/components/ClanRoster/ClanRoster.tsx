'use client';

import { UserSearch } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { DataTable, EmptyState, SectionHeader } from '@/ui-kit';

import type { ClanRosterProps } from './ClanRoster.types';

import { ROSTER } from '../../../config';
import { useRoster, useRosterColumns } from '../../../model/hooks';
import { ActivityStrip, RosterFilters } from './components';

import s from './ClanRoster.module.scss';

export const ClanRoster = ({ members, now }: ClanRosterProps) => {
  const t = useTranslations('clans.roster');
  const { role, idle, rows, total, distribution, isFiltered, setFilters, reset } = useRoster({ members, now });
  const columns = useRosterColumns();

  return (
    <section className={s.root}>
      <SectionHeader
        action={<span className={s.count}>{t('shown', { shown: rows.length, total })}</span>}
        description={t('description')}
        eyebrow={t('eyebrow')}
        index='// 01'
        title={t('title')}
      />
      <ActivityStrip distribution={distribution} total={total} />
      <RosterFilters
        idle={idle}
        isFiltered={isFiltered}
        role={role}
        onIdleChange={(next) => setFilters({ idle: next })}
        onReset={reset}
        onRoleChange={(next) => setFilters({ role: next })}
      />
      <DataTable
        caption={t('caption')}
        columns={columns}
        data={rows}
        emptyState={<EmptyState description={t('emptyDescription')} icon={<UserSearch size={28} />} title={t('emptyTitle')} />}
        getRowId={({ accountId }) => String(accountId)}
        rowHeight={ROSTER.rowHeight}
      />
    </section>
  );
};
