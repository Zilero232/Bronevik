'use client';

import { useFormatter, useTranslations } from 'next-intl';

import { EmptyState, RelativeTime } from '@/ui-kit';

import type { QueueBacklogProps } from './QueueBacklog.types';

import { QUEUE_BACKLOG_COLUMNS } from '../../../config';

import s from './QueueBacklog.module.scss';

export const QueueBacklog = ({ queues, collectedAt }: QueueBacklogProps) => {
  const t = useTranslations('status.page.collector');
  const format = useFormatter();

  if (queues.length === 0) {
    return <EmptyState isCompact isFramed title={t('noQueues')} />;
  }

  return (
    <div className={s.root}>
      <table className={s.table}>
        <thead>
          <tr>
            <th scope='col'>{t('queue')}</th>
            {QUEUE_BACKLOG_COLUMNS.map((column) => (
              <th key={column} scope='col'>
                {t(`counts.${column}`)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {queues.map((row) => (
            <tr key={row.queue}>
              <th scope='row'>{row.queue}</th>
              {QUEUE_BACKLOG_COLUMNS.map((column) => (
                <td key={column}>{format.number(row[column])}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {collectedAt && (
        <p className={s.meta}>
          {t('counted')} <RelativeTime value={collectedAt} />
        </p>
      )}
    </div>
  );
};
