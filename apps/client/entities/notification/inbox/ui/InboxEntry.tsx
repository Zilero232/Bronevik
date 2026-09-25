'use client';

import { clsx } from 'clsx';
import { useFormatter, useNow, useTranslations } from 'next-intl';

import { Link } from '@/shared/i18n/navigation';

import type { InboxEntryProps } from './InboxEntry.types';

import { InboxEventIcon } from './InboxEventIcon';

import s from './InboxEntry.module.scss';

const NOW_TICK_MS = 60_000;

export const InboxEntry = ({ item, density = 'full', className, onSelect }: InboxEntryProps) => {
  const t = useTranslations('inbox');
  const tEvents = useTranslations('notifications.events');
  const format = useFormatter();
  const now = useNow({ updateInterval: NOW_TICK_MS });

  const { event, title, body, url, createdAt, readAt } = item;
  const isUnread = readAt === null;
  const createdDate = new Date(createdAt);
  const rootClass = clsx(s.root, s[density], className);

  const onClick = () => onSelect?.(item);

  const content = (
    <>
      <InboxEventIcon event={event} size={density === 'compact' ? 'sm' : 'md'} />
      <span className={s.text}>
        <span className={s.meta}>
          <span className={s.event}>{tEvents(event)}</span>
          <time className={s.time} dateTime={createdAt} title={format.dateTime(createdDate, { dateStyle: 'medium', timeStyle: 'short' })}>
            {format.relativeTime(createdDate, now)}
          </time>
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
    <Link className={rootClass} data-unread={isUnread} href={url} onClick={onClick}>
      {content}
    </Link>
  ) : (
    <button className={rootClass} data-unread={isUnread} type='button' onClick={onClick}>
      {content}
    </button>
  );
};
