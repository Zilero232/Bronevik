'use client';

import { motion } from 'motion/react';
import { useFormatter, useTranslations } from 'next-intl';

import { EASE_OUT, REVEAL_VIEWPORT } from '@/shared/lib';

import type { ActivityStripProps } from './ActivityStrip.types';

import { ACTIVITY_STATUSES } from '../../../../../config';

import s from './ActivityStrip.module.scss';

export const ActivityStrip = ({ distribution, total }: ActivityStripProps) => {
  const t = useTranslations('clans.roster');
  const format = useFormatter();

  const share = (count: number) => (total > 0 ? count / total : 0);

  return (
    <figure className={s.root}>
      <figcaption className={s.caption}>{t('activityTitle')}</figcaption>
      <div aria-hidden className={s.bar}>
        {ACTIVITY_STATUSES.map((status, index) => (
          <motion.span
            key={status}
            className={s.segment}
            data-status={status}
            initial={{ scaleX: 0 }}
            style={{ flexGrow: distribution[status] }}
            transition={{ duration: 0.8, ease: EASE_OUT, delay: index * 0.08 }}
            viewport={REVEAL_VIEWPORT}
            whileInView={{ scaleX: 1 }}
          />
        ))}
      </div>
      <ul className={s.legend}>
        {ACTIVITY_STATUSES.map((status) => (
          <li key={status} className={s.item} data-status={status}>
            <span aria-hidden className={s.dot} />
            <span className={s.label}>{t(`status.${status}`)}</span>
            <span className={s.value}>{format.number(distribution[status])}</span>
            <span className={s.share}>{format.number(share(distribution[status]), { style: 'percent' })}</span>
          </li>
        ))}
      </ul>
    </figure>
  );
};
