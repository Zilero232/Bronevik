'use client';

import type { RatingPeriod } from '@bronevik/schemas';

import { useTranslations } from 'next-intl';

import { EntityPicker } from '@/features/search/pick-entity';
import { isNotFoundError } from '@/shared/api/source';
import { EmptyState, SectionHeader, SegmentedControl, Skeleton } from '@/ui-kit';

import { COMPARE_LIMIT } from '../config';
import { useCompareState, useComparison } from '../model/hooks';
import { CompareTable, PlayerSlot } from './components';

import s from './ComparePlayersPage.module.scss';

const PERIODS: readonly RatingPeriod[] = ['overall', '24h', '7d', '30d', '60d', '1000'];

export const ComparePlayersPage = () => {
  const t = useTranslations('compare');
  const tPeriods = useTranslations('periods');
  const { ids, period, setPeriod, canAdd, add, remove } = useCompareState();
  const { data: comparison, isPending, isError, error } = useComparison(ids);

  const isReady = ids.length >= COMPARE_LIMIT.min;
  const isMissing = isNotFoundError(error) || (comparison !== undefined && comparison.players.length < COMPARE_LIMIT.min);

  const options = PERIODS.map((value) => ({ value, label: value === 'overall' ? t('overall') : tPeriods(value) }));

  return (
    <div className={s.root}>
      <SectionHeader description={t('description')} eyebrow={t('eyebrow')} index='// VS' title={t('title')} />
      <div className={s.slots}>
        {ids.map((id, index) => (
          <PlayerSlot key={id} accountId={id} index={index} onRemove={() => remove(id)} />
        ))}
        {canAdd && (
          <div className={s.add}>
            <span className={s.addLabel}>{t('slot', { index: ids.length + 1, max: COMPARE_LIMIT.max })}</span>
            <EntityPicker excludeIds={ids} kind='player' placeholder={t('add')} onPick={({ accountId }) => add(accountId)} />
          </div>
        )}
      </div>
      <div className={s.toolbar}>
        <SegmentedControl<RatingPeriod>
          aria-label={tPeriods('label')}
          options={options}
          size='sm'
          value={period}
          onChange={(next) => setPeriod(next)}
        />
      </div>
      {ids.length < COMPARE_LIMIT.min && <EmptyState description={t('emptyDescription')} title={t('emptyTitle')} />}
      {isReady && isMissing && <EmptyState description={t('missingDescription')} title={t('missingTitle')} />}
      {isReady && isError && !isMissing && <EmptyState description={t('errorDescription')} title={t('errorTitle')} />}
      {isReady && isPending && <Skeleton height={520} shape='block' />}
      {isReady && comparison && !isMissing && <CompareTable comparison={comparison} period={period} />}
    </div>
  );
};
