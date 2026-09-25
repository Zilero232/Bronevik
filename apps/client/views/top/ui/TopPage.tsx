'use client';

import type { LeaderboardScope } from '@bronevik/schemas';

import { useTranslations } from 'next-intl';

import { EmptyState, SectionHeader, SegmentedControl, Skeleton } from '@/ui-kit';

import { PODIUM_SIZE, TOP_SCOPE_ICONS, TOP_SCOPES } from '../config';
import { useTop } from '../model/hooks';
import { TopFilters, TopPodium, TopTable } from './components';

import s from './TopPage.module.scss';

export const TopPage = () => {
  const t = useTranslations('top');
  const { state, filter, board, isPending, isError, isRefreshing, update } = useTop();

  const scopes = TOP_SCOPES.map((value) => {
    const Icon = TOP_SCOPE_ICONS[value];

    return { value, label: t(`scopes.${value}`), icon: <Icon size={15} /> };
  });

  return (
    <div className={s.root}>
      <SectionHeader description={t('description')} eyebrow={t('eyebrow')} index='// TOP' title={t('title')} />
      <div className={s.scopes}>
        <SegmentedControl<LeaderboardScope>
          aria-label={t('scopeLabel')}
          options={scopes}
          value={state.scope}
          onChange={(scope) => update({ scope })}
        />
      </div>
      <TopFilters state={state} onChange={update} />
      {board && board.minBattles !== null && <p className={s.threshold}>{t('minBattles', { count: board.minBattles })}</p>}
      {isError && <EmptyState description={t('errorDescription')} title={t('errorTitle')} />}
      {isPending && <Skeleton height={560} shape='block' />}
      {board && board.entries.length === 0 && <EmptyState description={t('emptyDescription')} title={t('emptyTitle')} />}
      {board && board.entries.length > 0 && (
        <div className={s.board} data-refreshing={isRefreshing}>
          <TopPodium entries={board.entries.slice(0, PODIUM_SIZE)} filter={filter} />
          <TopTable entries={board.entries.slice(PODIUM_SIZE)} filter={filter} />
        </div>
      )}
    </div>
  );
};
