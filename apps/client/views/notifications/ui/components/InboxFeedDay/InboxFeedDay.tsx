'use client';

import { isToday, isYesterday } from 'date-fns';
import { AnimatePresence, motion } from 'motion/react';
import { useFormatter, useTranslations } from 'next-intl';
import { match } from 'ts-pattern';

import { InboxEntry } from '@/entities/notification/inbox';

import type { InboxFeedDayProps } from './InboxFeedDay.types';

import s from './InboxFeedDay.module.scss';

export const InboxFeedDay = ({ day, onSelect }: InboxFeedDayProps) => {
  const t = useTranslations('notifications.feed');
  const format = useFormatter();

  const { date, items, unread } = day;

  const label = match(date)
    .when(isToday, () => t('today'))
    .when(isYesterday, () => t('yesterday'))
    .otherwise(() => format.dateTime(date, { weekday: 'short', day: 'numeric', month: 'long' }));

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
