'use client';

import { RefreshCw } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button, RelativeTime } from '@/ui-kit';

import type { StatusVerdictProps } from './StatusVerdict.types';

import { STATUS_PAGE } from '../../../config';

import s from './StatusVerdict.module.scss';

export const StatusVerdict = ({ verdict, status, checkedAt, isFetching, onRefresh }: StatusVerdictProps) => {
  const t = useTranslations('status.page');

  return (
    <section aria-live='polite' className={s.root} data-status={status}>
      <span aria-hidden className={s.dot} />
      <div className={s.body}>
        <h2 className={s.title}>{t(`verdict.${verdict}.title`)}</h2>
        <p className={s.text}>{t(`verdict.${verdict}.text`)}</p>
        <p className={s.meta}>
          {t('checked')} <RelativeTime fallback={t('never')} value={checkedAt} />
        </p>
      </div>
      <Button disabled={isFetching} size='sm' variant='secondary' onClick={onRefresh}>
        <RefreshCw aria-hidden size={STATUS_PAGE.refreshIcon} />
        {t('refresh')}
      </Button>
    </section>
  );
};
