'use client';

import { clsx } from 'clsx';
import { useTranslations } from 'next-intl';

import { Link } from '@/shared/i18n/navigation';
import { RelativeTime } from '@/ui-kit';

import type { InboxEntryProps } from './InboxEntry.types';

import { InboxEventIcon } from '../InboxEventIcon';

import s from './InboxEntry.module.scss';

export const InboxEntry = ({ item, density = 'full', className, onSelect }: InboxEntryProps) => {
  const t = useTranslations('inbox');
  const tEvents = useTranslations('notifications.events');
  const { event, title, body, url, createdAt, readAt } = item;
  const isUnread = readAt === null;
  const rootClass = clsx(s.root, s[density], className);

  const content = (
    <>
      <InboxEventIcon event={event} size={density === 'compact' ? 'sm' : 'md'} />
      <span className={s.text}>
        <span className={s.meta}>
          <span className={s.event}>{tEvents(event)}</span>
          <RelativeTime className={s.time} value={createdAt} />
        </span>
        <span className={s.title}>{title}</span>
        <span className={s.body}>{body}</span>
      </span>
      {isUnread && (
        <span className={s.dot}>
          <span className={s.srOnly}>{t('unread')}</span>
        </span>
      )}
    </>
  );

  return url ? (
    <Link className={rootClass} data-unread={isUnread} href={url} onClick={() => onSelect?.(item)}>
      {content}
    </Link>
  ) : (
    <button className={rootClass} data-unread={isUnread} type='button' onClick={() => onSelect?.(item)}>
      {content}
    </button>
  );
};
