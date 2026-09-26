'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useTranslations } from 'next-intl';

import { InboxEntry } from '@/entities/notification/inbox';

import type { InboxFeedDayProps } from './InboxFeedDay.types';

import { useFeedDayLabel } from '../../../model/hooks';

import s from './InboxFeedDay.module.scss';

export const InboxFeedDay = ({ day, onSelect }: InboxFeedDayProps) => {
  const t = useTranslations('notifications.feed');
  const label = useFeedDayLabel(day.date);

  const { items, unread } = day;

  return (
    <section className={s.root}>
      <h3 className={s.head}>
        <span className={s.label}>{label}</span>
        <span className={s.count}>
          {unread > 0 ? t('dayUnread', { count: unread, total: items.length }) : t('dayTotal', { total: items.length })}
        </span>
      </h3>
      <motion.ul animate='visible' className={s.list} initial='hidden'>
        <AnimatePresence initial={false}>
          {items.map((item) => (
            <motion.li layout key={item.id} exit={{ opacity: 0, height: 0 }}>
              <InboxEntry item={item} onSelect={onSelect} />
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
    </section>
  );
};
