'use client';

import { useFormatter, useTranslations } from 'next-intl';

import { useSettingsFormatter } from '@/entities/streamer/settings';
import { Card, CardHeader, EmptyState, ErrorState, Skeleton } from '@/ui-kit';

import type { SettingsHistoryProps } from './SettingsHistory.types';

import { useSettingsHistory } from '../../../model/hooks';

import s from './SettingsHistory.module.scss';

export const SettingsHistory = ({ slug }: SettingsHistoryProps) => {
  const t = useTranslations('streamerSettings.page.history');
  const format = useFormatter();
  const { groupLabel, sourceLabel } = useSettingsFormatter();
  const { entries, isPending, isError, isRetrying, retry } = useSettingsHistory(slug);

  return (
    <Card padding='md' variant='panel'>
      <CardHeader title={t('title')} />
      {isPending && <Skeleton height={120} shape='block' />}
      {isError && <ErrorState isCompact isRetrying={isRetrying} onRetry={retry} />}
      {!isPending && !isError && entries.length === 0 && <EmptyState isCompact title={t('empty')} />}
      {entries.length > 0 && (
        <ol className={s.list}>
          {entries.map((entry) => (
            <li key={entry.id} className={s.item}>
              <time className={s.date} dateTime={entry.createdAt}>
                {format.dateTime(new Date(entry.createdAt), 'date')}
              </time>
              <span className={s.source}>{sourceLabel(entry.source)}</span>
              <span className={s.groups}>
                {entry.changedGroups.length === 0
                  ? t('noChanges')
                  : entry.changedGroups.map((group) => (
                      <span key={group} className={s.group}>
                        {groupLabel(group)}
                      </span>
                    ))}
              </span>
            </li>
          ))}
        </ol>
      )}
    </Card>
  );
};
