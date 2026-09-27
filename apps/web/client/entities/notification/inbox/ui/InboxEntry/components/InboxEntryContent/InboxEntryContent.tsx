'use client';

import { useTranslations } from 'next-intl';

import { RelativeTime } from '@/ui-kit';

import type { InboxEntryContentProps } from './InboxEntryContent.types';

import { InboxEventIcon } from '../../../InboxEventIcon';

import s from '../../InboxEntry.module.scss';

export const InboxEntryContent = ({ item, density }: InboxEntryContentProps) => {
  const t = useTranslations('inbox');
  const tEvents = useTranslations('notifications.events');

  return (
    <>
      <InboxEventIcon event={item.event} size={density === 'compact' ? 'sm' : 'md'} />
      <span className={s.text}>
        <span className={s.meta}>
          <span className={s.event}>{tEvents(item.event)}</span>
          <RelativeTime className={s.time} value={item.createdAt} />
        </span>
        <span className={s.title}>{item.title}</span>
        <span className={s.body}>{item.body}</span>
      </span>
      {item.readAt === null && (
        <span className={s.dot}>
          <span className={s.srOnly}>{t('unread')}</span>
        </span>
      )}
    </>
  );
};
