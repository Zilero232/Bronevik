'use client';

import { isToday, isYesterday } from 'date-fns';
import { AnimatePresence, motion } from 'motion/react';
import { useFormatter, useTranslations } from 'next-intl';
import { match } from 'ts-pattern';

import { InboxEntry } from '@/entities/notification/inbox';
import { ROW_ITEM } from '@/shared/lib';

import type { InboxFeedDayProps } from './InboxFeedDay.types';

import s from './InboxFeedDay.module.scss';

export const InboxFeedDay = ({ day, onSelect }: InboxFeedDayProps) => {
  const t = useTranslations('notifications.feed');
  const format = useFormatter();

  const { date, items } = day;
  const unread = items.filter(({ readAt }) => readAt === null).length;

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
          {items.map((item, index) => (
            <motion.li layout key={item.id} custom={index} exit={{ opacity: 0, height: 0 }} variants={ROW_ITEM}>
              <InboxEntry item={item} onSelect={onSelect} />
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
    </section>
  );
};
