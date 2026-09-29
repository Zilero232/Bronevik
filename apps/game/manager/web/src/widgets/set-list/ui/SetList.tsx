import { Boxes } from 'lucide-react';
import { useTranslations } from 'use-intl';

import { SetActions } from '@/features/component-set/set-actions';
import { Badge, Card, EmptyState, QueryState } from '@/ui-kit';

import { useSetList } from '../model/hooks';

import s from './SetList.module.scss';

export const SetList = () => {
  const t = useTranslations();
  const { setsQuery, count, max, rows } = useSetList();

  return (
    <Card actions={max > 0 && <Badge>{t('sets.count', { count, max })}</Badge>} title={t('sets.listTitle')}>
      <QueryState errorTitle={t('common.loadFailed')} loadingLabel={t('common.loading')} query={setsQuery} retryLabel={t('common.retry')}>
        {() =>
          rows.length > 0 ? (
            <ul className={s.list}>
              {rows.map(({ set, updated }) => (
                <li key={set.id} className={s.row}>
                  <div className={s.text}>
                    <span className={s.name}>{set.name}</span>
                    <span className={s.meta}>
                      {t('sets.components', { count: set.components.length })}
                      {updated && ` · ${t('sets.updated', { date: updated })}`}
                    </span>
                  </div>
                  <SetActions set={set} />
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState hint={t('sets.emptyHint')} icon={<Boxes />} title={t('sets.empty')} />
          )
        }
      </QueryState>
    </Card>
  );
};
