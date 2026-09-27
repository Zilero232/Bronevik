'use client';

import { AnimatePresence, motion } from 'motion/react';

import { InboxEntry } from '@/entities/notification/inbox';

import type { InboxFeedDayProps } from './InboxFeedDay.types';

import { useInboxFeedDay } from '../../../model/hooks';

import s from './InboxFeedDay.module.scss';

export const InboxFeedDay = ({ day }: InboxFeedDayProps) => {
  const { label, count, onSelect } = useInboxFeedDay(day);

  return (
    <section className={s.root}>
      <h3 className={s.head}>
        <span className={s.label}>{label}</span>
        <span className={s.count}>{count}</span>
      </h3>
      <motion.ul animate='visible' className={s.list} initial='hidden'>
        <AnimatePresence initial={false}>
          {day.items.map((item) => (
            <motion.li layout key={item.id} exit={{ opacity: 0, height: 0 }}>
              <InboxEntry item={item} onSelect={onSelect} />
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
    </section>
  );
};
