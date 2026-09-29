'use client';

import { useTranslations } from 'next-intl';

import { RelativeTime } from '@/ui-kit';

import type { StatusComponentProps } from './StatusComponent.types';

import s from './StatusComponent.module.scss';

export const StatusComponent = ({ component: { key, status, note, checkedAt } }: StatusComponentProps) => {
  const t = useTranslations('status.page');

  return (
    <li className={s.root} data-status={status}>
      <span aria-hidden className={s.dot} />
      <div className={s.body}>
        <h3 className={s.name}>{t(`components.${key}`)}</h3>
        <p className={s.note}>{t(`notes.${note}`)}</p>
        {checkedAt && (
          <p className={s.meta}>
            {t('heartbeat')} <RelativeTime value={checkedAt} />
          </p>
        )}
      </div>
    </li>
  );
};
