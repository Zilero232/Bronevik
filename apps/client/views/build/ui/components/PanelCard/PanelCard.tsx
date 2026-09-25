'use client';

import { clsx } from 'clsx';
import { motion } from 'motion/react';
import { useId } from 'react';

import { STAGGER_ITEM } from '@/shared/lib';

import type { PanelCardProps } from './PanelCard.types';

import s from './PanelCard.module.scss';

export const PanelCard = ({ index, title, description, icon: Icon, action, children, className }: PanelCardProps) => {
  const titleId = useId();

  return (
    <motion.section aria-labelledby={titleId} className={clsx(s.root, className)} variants={STAGGER_ITEM}>
      <header className={s.header}>
        <span aria-hidden className={s.icon}>
          <Icon size={18} strokeWidth={1.75} />
        </span>
        <div className={s.heading}>
          <span className={s.index}>{index}</span>
          <h2 className={s.title} id={titleId}>
            {title}
          </h2>
          {description && <p className={s.description}>{description}</p>}
        </div>
        {action && <div className={s.action}>{action}</div>}
      </header>
      <div className={s.body}>{children}</div>
    </motion.section>
  );
};
