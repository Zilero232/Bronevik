'use client';

import type { SettingsCohort } from '@otmetki/schemas';

import { STREAMER_SETTINGS } from '@otmetki/schemas';
import { Users } from 'lucide-react';
import { useFormatter, useTranslations } from 'next-intl';

import { Card, CardHeader, EmptyState, ErrorState, Skeleton, Tabs } from '@/ui-kit';

import { useSettingsAggregates } from '../../../model/hooks';
import { AggregateFieldCard } from './components';

import s from './TopSettings.module.scss';

export const TopSettings = () => {
  const t = useTranslations('streamerSettings.aggregates');
  const format = useFormatter();
  const { cohort, minCohort, computedAt, fields, isPending, isError, isRetrying, retry, onCohortChange } = useSettingsAggregates();

  return (
    <Card className={s.root} padding='md' variant='panel'>
      <CardHeader
        meta={computedAt && <span className={s.note}>{t('computedAt', { date: format.dateTime(new Date(computedAt), 'date') })}</span>}
        title={t('title')}
      />
      <Tabs<SettingsCohort>
        items={STREAMER_SETTINGS.cohorts.map((value) => ({ value, label: t(`cohorts.${value}`) }))}
        value={cohort}
        variant='strip'
        onValueChange={onCohortChange}
      />
      {isPending && <Skeleton height={180} shape='block' />}
      {isError && <ErrorState isCompact isRetrying={isRetrying} onRetry={retry} />}
      {!isPending && !isError && fields.length === 0 && (
        <EmptyState
          isCompact
          description={t('emptyDescription', { min: minCohort ?? STREAMER_SETTINGS.minCohort })}
          icon={<Users size={20} />}
          title={t('emptyTitle')}
        />
      )}
      {fields.length > 0 && (
        <div className={s.grid}>
          {fields.map((field) => (
            <AggregateFieldCard key={field.field} field={field} />
          ))}
        </div>
      )}
      <p className={s.note}>{t('privacy')}</p>
    </Card>
  );
};
