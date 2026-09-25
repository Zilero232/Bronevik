'use client';

import { toRoman } from '@bronevik/icons';
import { LayoutGroup } from 'motion/react';
import { useTranslations } from 'next-intl';

import { EmptyState, SegmentedControl, Skeleton } from '@/ui-kit';

import { TIER_LIST_TIERS } from '../../../config';
import { groupByRank } from '../../../lib/tier-groups';
import { useTanksState, useTierList } from '../../../model/hooks';
import { TierBand } from '../TierBand';

import s from './TierList.module.scss';

export const TierList = () => {
  const t = useTranslations('tanks.tierList');
  const [{ tier }, setState] = useTanksState();
  const { data, isLoading, isError } = useTierList();

  const groups = groupByRank(data?.entries ?? []);

  return (
    <section aria-label={t('title')} className={s.root}>
      <div className={s.head}>
        <p className={s.hint}>{t('hint')}</p>
        <SegmentedControl
          aria-label={t('tier')}
          options={TIER_LIST_TIERS.map((value) => ({ value: String(value), label: toRoman(value) }))}
          size='sm'
          value={String(tier)}
          onChange={(next) => setState({ tier: Number(next) })}
        />
      </div>
      {isLoading && <Skeleton height={320} shape='block' width='100%' />}
      {isError && <EmptyState code='ERR' description={t('errorDescription')} title={t('errorTitle')} />}
      {!isLoading && !isError && groups.length === 0 && <EmptyState description={t('emptyDescription')} title={t('emptyTitle')} />}
      <LayoutGroup>
        <div className={s.bands}>
          {groups.map((group) => (
            <TierBand key={group.rank} group={group} />
          ))}
        </div>
      </LayoutGroup>
    </section>
  );
};
