'use client';

import { CheckCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button, SegmentedControl } from '@/ui-kit';

import type { InboxFeedFilter } from '../../../model/notifications.types';
import type { InboxFeedHeaderProps } from './InboxFeedHeader.types';

import { INBOX_FEED } from '../../../config';

import s from './InboxFeedHeader.module.scss';

export const InboxFeedHeader = ({ filter, unread, onFilterChange, onMarkAll }: InboxFeedHeaderProps) => {
  const t = useTranslations('notifications.feed');

  return (
    <header className={s.root}>
      <div className={s.heading}>
        <span className={s.eyebrow}>{t('eyebrow')}</span>
        <h2 className={s.title}>{t('title')}</h2>
      </div>
      <div className={s.controls}>
        <SegmentedControl<InboxFeedFilter>
          options={INBOX_FEED.filters.map((value) => ({
            value,
            label: value === 'unread' && unread > 0 ? `${t(`filter.${value}`)} · ${unread}` : t(`filter.${value}`)
          }))}
          aria-label={t('filterLabel')}
          size='sm'
          value={filter}
          onChange={onFilterChange}
        />
        <Button disabled={unread === 0} size='sm' variant='ghost' onClick={onMarkAll}>
          <CheckCheck size={15} />
          {t('markAll')}
        </Button>
      </div>
    </header>
  );
};
