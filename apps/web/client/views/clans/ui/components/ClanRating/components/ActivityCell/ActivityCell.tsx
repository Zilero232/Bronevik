'use client';

import { useFormatter, useTranslations } from 'next-intl';

import { CellBar } from '@/ui-kit';

import type { ActivityCellProps } from './ActivityCell.types';

export const ActivityCell = ({ item: { activeMembers7d, clan } }: ActivityCellProps) => {
  const t = useTranslations('clans.rating');
  const format = useFormatter();

  return activeMembers7d === null ? (
    format.number(clan.membersCount)
  ) : (
    <CellBar max={clan.membersCount} value={activeMembers7d}>
      {t('active', { active: activeMembers7d, total: clan.membersCount })}
    </CellBar>
  );
};
