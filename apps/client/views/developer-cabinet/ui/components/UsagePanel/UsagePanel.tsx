'use client';

import { Activity } from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { match, P } from 'ts-pattern';

import { STAGGER_ITEM } from '@/shared/lib';
import { EmptyState, SectionHeader, SegmentedControl, Select, Skeleton } from '@/ui-kit';

import type { UsagePeriod } from './UsagePanel.types';

import { USAGE } from '../../../config';
import { useApiKeys, useApiKeyUsage } from '../../../model/hooks';
import { ErrorLog, TopEndpoints, UsageCharts, UsageToday } from './components';

import s from './UsagePanel.module.scss';

export const UsagePanel = () => {
  const t = useTranslations('developer.usage');
  const { data: keys } = useApiKeys();
  const [keyId, setKeyId] = useState('');
  const [period, setPeriod] = useState<UsagePeriod>(USAGE.initialPeriod);

  const selectedId = keys?.some(({ id }) => id === keyId) ? keyId : (keys?.[0]?.id ?? '');
  const { data: usage, isPlaceholderData } = useApiKeyUsage({ id: selectedId, days: Number(period) });

  return (
    <motion.section className={s.root} id='usage' variants={STAGGER_ITEM}>
      <SectionHeader description={t('description')} eyebrow={t('eyebrow')} index='02' title={t('title')} />
      {keys && keys.length > 0 && (
        <div className={s.toolbar}>
          <Select
            className={s.key}
            items={keys.map(({ id, name }) => ({ value: id, label: name }))}
            label={t('key')}
            value={selectedId}
            onValueChange={setKeyId}
          />
          <SegmentedControl<UsagePeriod>
            aria-label={t('period')}
            options={USAGE.periods.map((value) => ({ value, label: t('days', { count: Number(value) }) }))}
            size='sm'
            value={period}
            onChange={setPeriod}
          />
        </div>
      )}
      {match({ selectedId, usage })
        .with({ selectedId: '' }, () => <EmptyState description={t('noKeysHint')} icon={<Activity size={22} />} title={t('noKeys')} />)
        .with({ usage: P.nonNullable }, ({ usage: loaded }) => (
          <div className={s.body} data-stale={isPlaceholderData}>
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
    </motion.section>
  );
};
