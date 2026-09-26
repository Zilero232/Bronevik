'use client';

import { Activity } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { match, P } from 'ts-pattern';

import { EmptyState, ErrorState, SectionHeader, SegmentedControl, Select, Skeleton } from '@/ui-kit';

import type { UsagePeriod } from '../../../model/hooks';

import { USAGE } from '../../../config';
import { useUsagePanel } from '../../../model/hooks';
import { ErrorLog } from '../ErrorLog';
import { TopEndpoints, UsageCharts, UsageToday } from './components';

import s from './UsagePanel.module.scss';

export const UsagePanel = () => {
  const t = useTranslations('developer.usage');
  const { keyItems, selectedId, setKeyId, period, setPeriod, usage, isStale, isFailed, isRetrying, onRetry } = useUsagePanel();

  return (
    <section className={s.root} id='usage'>
      <SectionHeader description={t('description')} title={t('title')} />
      {keyItems.length > 0 && (
        <div className={s.toolbar}>
          <Select className={s.key} items={keyItems} label={t('key')} value={selectedId} onValueChange={setKeyId} />
          <SegmentedControl<UsagePeriod>
            aria-label={t('period')}
            options={USAGE.periods.map((value) => ({ value, label: t('days', { count: Number(value) }) }))}
            size='sm'
            value={period}
            onChange={setPeriod}
          />
        </div>
      )}
      {match({ selectedId, usage, isFailed })
        .with({ isFailed: true }, () => <ErrorState isRetrying={isRetrying} onRetry={onRetry} />)
        .with({ selectedId: '' }, () => <EmptyState description={t('noKeysHint')} icon={<Activity size={22} />} title={t('noKeys')} />)
        .with({ usage: P.nonNullable }, ({ usage: loaded }) => (
          <div className={s.body} data-stale={isStale}>
            <UsageToday usage={loaded} />
            <UsageCharts history={loaded.history} />
            <div className={s.split}>
              <TopEndpoints endpoints={loaded.topEndpoints} />
              <ErrorLog keyId={selectedId} />
            </div>
          </div>
        ))
        .otherwise(() => (
          <Skeleton height={320} shape='block' />
        ))}
    </section>
  );
};
