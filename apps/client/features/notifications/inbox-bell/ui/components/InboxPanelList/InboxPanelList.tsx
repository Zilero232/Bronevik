'use client';

import { clsx } from 'clsx';
import { BellOff } from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import { match } from 'ts-pattern';

import { InboxEntry } from '@/entities/notification/inbox';
import { ROW_ITEM } from '@/shared/lib';
import { Skeleton } from '@/ui-kit';

import type { InboxPanelListProps } from './InboxPanelList.types';

import s from './InboxPanelList.module.scss';

const SKELETON_ROWS = 4;

export const InboxPanelList = ({ items, isPending, isError, onSelect }: InboxPanelListProps) => {
  const t = useTranslations('inbox');

  return match({ isPending, isError, isEmpty: items.length === 0 })
    .with({ isPending: true }, () => (
      <div aria-busy className={s.state}>
        {Array.from({ length: SKELETON_ROWS }, (_, index) => (
          <Skeleton key={index} height={56} shape='block' />
        ))}
      </div>
    ))
    .with({ isError: true }, () => <p className={clsx(s.message, s.error)}>{t('error')}</p>)
    .with({ isEmpty: true }, () => (
      <div className={s.empty}>
        <BellOff aria-hidden size={22} />
        <p className={s.emptyTitle}>{t('empty')}</p>
        <p className={s.message}>{t('emptyHint')}</p>
      </div>
    ))
    .otherwise(() => (
      <motion.ul animate='visible' className={s.list} initial='hidden'>
        {items.map((item, index) => (
          <motion.li key={item.id} custom={index} variants={ROW_ITEM}>
            <InboxEntry density='compact' item={item} onSelect={onSelect} />
          </motion.li>
        ))}
      </motion.ul>
    ));
};
