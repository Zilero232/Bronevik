'use client';

import { clsx } from 'clsx';

import { Link } from '@/shared/i18n/navigation';

import type { InboxEntryProps } from './InboxEntry.types';

import { InboxEntryContent } from './components';

import s from './InboxEntry.module.scss';

export const InboxEntry = ({ item, density = 'full', className, onSelect }: InboxEntryProps) =>
  item.url ? (
    <Link className={clsx(s.root, s[density], className)} data-unread={item.readAt === null} href={item.url} onClick={() => onSelect?.(item)}>
      <InboxEntryContent density={density} item={item} />
    </Link>
  ) : (
    <button className={clsx(s.root, s[density], className)} data-unread={item.readAt === null} type='button' onClick={() => onSelect?.(item)}>
      <InboxEntryContent density={density} item={item} />
    </button>
  );
