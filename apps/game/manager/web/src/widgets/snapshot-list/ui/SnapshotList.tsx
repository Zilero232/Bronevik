import { Archive } from 'lucide-react';
import { useTranslations } from 'use-intl';

import { SnapshotActions } from '@/features/snapshot/snapshot-actions';
import { useQueryLabels } from '@/shared/lib';
import { Card, EmptyState, QueryState } from '@/ui-kit';

import { useSnapshotList } from '../model/hooks';

import s from './SnapshotList.module.scss';

export const SnapshotList = () => {
  const t = useTranslations();
  const queryLabels = useQueryLabels();
  const { clientPath, snapshotsQuery, rows } = useSnapshotList();

  return (
    <Card title={t('backups.title')}>
      <QueryState {...queryLabels} query={snapshotsQuery}>
        {() =>
          rows.length > 0 ? (
            <ul className={s.list}>
              {rows.map((row) => (
                <li key={row.id} className={s.row}>
                  <div className={s.text}>
                    <span className={s.date}>{row.date}</span>
                    <span className={s.meta}>
                      {row.kind} · {row.size} · {row.parts.join(' · ')}
                    </span>
                  </div>
                  <SnapshotActions clientPath={clientPath} dateLabel={row.date} id={row.id} />
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState hint={t('backups.emptyHint')} icon={<Archive />} title={t('backups.empty')} />
          )
        }
      </QueryState>
    </Card>
  );
};
