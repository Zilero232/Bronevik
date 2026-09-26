'use client';

import { BellOff } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { match } from 'ts-pattern';

import { InboxEntry } from '@/entities/notification/inbox';
import { RetryButton, Skeleton } from '@/ui-kit';

import type { InboxPanelListProps } from './InboxPanelList.types';

import { INBOX_BELL } from '../../../config';

import s from './InboxPanelList.module.scss';

export const InboxPanelList = ({ items, isPending, isError, isRetrying, onRetry, onSelect }: InboxPanelListProps) => {
  const t = useTranslations('inbox');

  return match({ isPending, isError, isEmpty: items.length === 0 })
    .with({ isPending: true }, () => (
      <div aria-busy className={s.state}>
        {Array.from({ length: INBOX_BELL.skeletonRows }, (_, index) => (
          <Skeleton key={index} height={INBOX_BELL.skeletonHeight} shape='block' />
        ))}
      </div>
    ))
    .with({ isError: true }, () => (
      <div className={s.status}>
        <p className={s.message}>{t('error')}</p>
        <RetryButton disabled={isRetrying} size='sm' variant='ghost' onClick={onRetry} />
      </div>
    ))
    .with({ isEmpty: true }, () => (
      <div className={s.status}>
        <BellOff aria-hidden size={16} />
        <p className={s.message}>{t('empty')}</p>
      </div>
    ))
    .otherwise(() => (
      <ul className={s.list}>
        {items.map((item) => (
          <li key={item.id}>
            <InboxEntry density='compact' item={item} onSelect={onSelect} />
          </li>
        ))}
      </ul>
    ));
};
