'use client';

import { useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import { DataTable, EmptyState } from '@/ui-kit';

import type { ClanRosterProps } from './ClanRoster.types';

import { useRoster } from '../../../model/hooks';
import { useRosterColumns } from '../../../model/hooks/use-roster-columns';
import { ActivityStrip, RosterFilters } from './components';

import s from './ClanRoster.module.scss';

export const ClanRoster = ({ members, now }: ClanRosterProps) => {
  const t = useTranslations('clans.roster');
  const { rows, total, distribution, shares } = useRoster({ members, now });
  const columns = useRosterColumns();

  return (
    <div className={s.root}>
      <ActivityStrip distribution={distribution} shares={shares} />
      <RosterFilters />
      <DataTable
        caption={t('caption')}
        columns={columns}
        data={rows}
        emptyState={<EmptyState isCompact description={t('emptyDescription')} title={t('emptyTitle')} />}
        getRowId={({ accountId }) => String(accountId)}
        getRowLink={({ nickname }) => ({ href: ROUTES.players.profile(nickname), label: nickname, hasCellLink: true })}
        summary={t('shown', { shown: rows.length, total })}
      />
    </div>
  );
};
