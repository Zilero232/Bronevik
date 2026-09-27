'use client';

import type { SettingsCohort } from '@otmetki/schemas';

import { STREAMER_SETTINGS } from '@otmetki/schemas';
import { Users } from 'lucide-react';
import { useFormatter, useTranslations } from 'next-intl';

import { Card, CardHeader, EmptyState, QueryState, Skeleton, Tabs } from '@/ui-kit';

import { useSettingsAggregates } from '../../../model/hooks';
import { AggregateFieldCard } from './components';

import s from './TopSettings.module.scss';

export const TopSettings = () => {
  const t = useTranslations('streamerSettings.aggregates');
  const format = useFormatter();
  const { cohort, query, onCohortChange } = useSettingsAggregates();

  return (
    <Card className={s.root} padding='md' variant='panel'>
      <CardHeader
        meta={
          query.data?.computedAt && (
            <span className={s.note}>{t('computedAt', { date: format.dateTime(new Date(query.data.computedAt), 'date') })}</span>
          )
        }
        title={t('title')}
      />
      <Tabs<SettingsCohort>
        items={STREAMER_SETTINGS.cohorts.map((value) => ({ value, label: t(`cohorts.${value}`) }))}
        value={cohort}
        variant='strip'
        onValueChange={onCohortChange}
      />
      <QueryState
        isCompact
        empty={
          <EmptyState
            isCompact
            description={t('emptyDescription', { min: query.data?.minCohort ?? STREAMER_SETTINGS.minCohort })}
            icon={<Users size={20} />}
            title={t('emptyTitle')}
          />
        }
        isEmpty={({ fields }) => fields.length === 0}
        query={query}
        skeleton={<Skeleton height={180} shape='block' />}
      >
        {({ fields }) => (
          <div className={s.grid}>
            {fields.map((field) => (
              <AggregateFieldCard key={field.field} field={field} />
            ))}
          </div>
        )}
      </QueryState>
      <p className={s.note}>{t('privacy')}</p>
    </Card>
  );
};
