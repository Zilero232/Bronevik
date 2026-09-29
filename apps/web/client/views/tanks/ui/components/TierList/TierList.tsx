'use client';

import { useTranslations } from 'next-intl';

import { EmptyState, QueryState, Skeleton, TierPicker } from '@/ui-kit';

import { TANKS_VIEW, TIER_LIST_TIERS } from '../../../config';
import { useTierList } from '../../../model/hooks';
import { TierBand } from '../TierBand';

import s from './TierList.module.scss';

export const TierList = () => {
  const t = useTranslations('tanks.tierList');
  const { tier, query, onTierChange } = useTierList();

  return (
    <section aria-label={t('title')} className={s.root}>
      <div className={s.head}>
        <TierPicker
          isRequired
          aria-label={t('tier')}
          mode='single'
          options={TIER_LIST_TIERS}
          value={[tier]}
          onChange={([next]) => onTierChange(String(next))}
        />
        <p className={s.hint}>{t('hint')}</p>
      </div>
      <QueryState
        empty={<EmptyState title={t('emptyTitle')} />}
        query={query}
        skeleton={<Skeleton height={TANKS_VIEW.tierListSkeleton} shape='block' width='100%' />}
      >
        {(groups) => (
          <div className={s.bands}>
            {groups.map((group) => (
              <TierBand key={group.rank} group={group} />
            ))}
          </div>
        )}
      </QueryState>
    </section>
  );
};
