'use client';

import { BellOff } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { InboxEntry } from '@/entities/notification/inbox';
import { QueryState, RetryButton, Skeleton } from '@/ui-kit';

import { INBOX_BELL } from '../../../config';
import { useInboxPanelList } from '../../../model/hooks';

import s from './InboxPanelList.module.scss';

export const InboxPanelList = () => {
  const t = useTranslations('inbox');
  const { query, onSelect } = useInboxPanelList();

  return (
    <QueryState
      empty={
        <div className={s.status}>
          <BellOff aria-hidden size={16} />
          <p className={s.message}>{t('empty')}</p>
        </div>
      }
      errorState={
        <div className={s.status}>
          <p className={s.message}>{t('error')}</p>
          <RetryButton disabled={query.isRefetching} size='sm' variant='ghost' onClick={query.refetch} />
        </div>
      }
      skeleton={
        <div aria-busy className={s.state}>
          <Skeleton count={INBOX_BELL.skeletonRows} height={INBOX_BELL.skeletonHeight} shape='block' />
        </div>
      }
      query={query}
    >
      {(items) => (
        <ul className={s.list}>
          {items.map((item) => (
            <li key={item.id}>
              <InboxEntry density='compact' item={item} onSelect={onSelect} />
            </li>
          ))}
        </ul>
      )}
    </QueryState>
  );
};
