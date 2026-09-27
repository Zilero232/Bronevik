'use client';

import { useFormatter, useTranslations } from 'next-intl';

import type { ActivityStripProps } from './ActivityStrip.types';

import { ACTIVITY_STATUSES } from '../../../../../config';

import s from './ActivityStrip.module.scss';

export const ActivityStrip = ({ distribution, shares }: ActivityStripProps) => {
  const t = useTranslations('clans.roster');
  const format = useFormatter();

  return (
    <figure className={s.root}>
      <figcaption className={s.caption}>{t('activityTitle')}</figcaption>
      <div aria-hidden className={s.bar}>
        {ACTIVITY_STATUSES.map((status) => (
          <span key={status} className={s.segment} data-status={status} style={{ flexGrow: distribution[status] }} />
        ))}
      </div>
      <ul className={s.legend}>
        {ACTIVITY_STATUSES.map((status) => (
          <li key={status} className={s.item} data-status={status}>
            <span aria-hidden className={s.dot} />
            <span className={s.label}>{t(`status.${status}`)}</span>
            <span className={s.value}>{format.number(distribution[status])}</span>
            <span className={s.share}>{format.number(shares[status], { style: 'percent' })}</span>
          </li>
        ))}
      </ul>
    </figure>
  );
};
