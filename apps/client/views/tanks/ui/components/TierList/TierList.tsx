'use client';

import { useTranslations } from 'next-intl';
import { match } from 'ts-pattern';

import { EmptyState, ErrorState, IconFilter, Skeleton } from '@/ui-kit';

import { TANKS_VIEW, TIER_LIST_TIERS } from '../../../config';
import { useTierList } from '../../../model/hooks';
import { TierBand } from '../TierBand';

import s from './TierList.module.scss';

export const TierList = () => {
  const t = useTranslations('tanks.tierList');
  const { tier, groups, isLoading, isError, isFetching, refetch, onTierChange } = useTierList();

  return (
    <section aria-label={t('title')} className={s.root}>
      <div className={s.head}>
        <IconFilter
          aria-label={t('tier')}
          isMultiple={false}
          kind='tier'
          options={TIER_LIST_TIERS}
          size='sm'
          value={[tier]}
          onChange={([next]) => onTierChange(String(next))}
        />
        <p className={s.hint}>{t('hint')}</p>
      </div>
      {match({ isLoading, isError, isEmpty: groups.length === 0 })
        .with({ isLoading: true }, () => <Skeleton height={TANKS_VIEW.tierListSkeleton} shape='block' width='100%' />)
        .with({ isError: true }, () => <ErrorState isRetrying={isFetching} onRetry={() => void refetch()} />)
        .with({ isEmpty: true }, () => <EmptyState title={t('emptyTitle')} />)
        .otherwise(() => (
          <div className={s.bands}>
            {groups.map((group) => (
              <TierBand key={group.rank} group={group} />
            ))}
          </div>
        ))}
    </section>
  );
};
