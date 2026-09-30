'use client';

import { AnimatePresence } from 'motion/react';
import * as m from 'motion/react-m';

import { InboxEntry } from '@/entities/notification/inbox';

import type { InboxFeedDayProps } from './InboxFeedDay.types';

import { useInboxFeedDay } from '../../../model/hooks';
import { INBOX_ENTRY_EXIT } from './InboxFeedDay.motion';

import s from './InboxFeedDay.module.scss';

export const InboxFeedDay = ({ day }: InboxFeedDayProps) => {
  const { label, count, onSelect } = useInboxFeedDay(day);

  return (
    <section className={s.root}>
      <h3 className={s.head}>
        <span className={s.label}>{label}</span>
        <span className={s.count}>{count}</span>
      </h3>
      <m.ul animate='visible' className={s.list} initial='hidden'>
        <AnimatePresence initial={false}>
          {day.items.map((item) => (
            <m.li layout key={item.id} {...INBOX_ENTRY_EXIT}>
              <InboxEntry item={item} onSelect={onSelect} />
            </m.li>
          ))}
        </AnimatePresence>
      </m.ul>
    </section>
  );
};
