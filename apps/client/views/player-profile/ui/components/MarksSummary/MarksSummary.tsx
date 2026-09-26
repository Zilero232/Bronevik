'use client';

import { MarkOfExcellenceIcon, MasteryIcon } from '@otmetki/icons';
import { useFormatter, useTranslations } from 'next-intl';

import type { MarksSummaryProps } from './MarksSummary.types';

import s from './MarksSummary.module.scss';

export const MarksSummary = ({ counts }: MarksSummaryProps) => {
  const t = useTranslations('profile.marks.summary');
  const format = useFormatter();

  return (
    <dl className={s.root}>
      <div className={s.item}>
        <MarkOfExcellenceIcon aria-hidden marks={3} size={20} />
        <dt className={s.label}>{t('moe3')}</dt>
        <dd className={s.value}>{format.number(counts.moe3)}</dd>
      </div>
      <div className={s.item}>
        <MarkOfExcellenceIcon aria-hidden marks={2} size={20} />
        <dt className={s.label}>{t('moe2')}</dt>
        <dd className={s.value}>{format.number(counts.moe2)}</dd>
      </div>
      <div className={s.item}>
        <MarkOfExcellenceIcon aria-hidden marks={1} size={20} />
        <dt className={s.label}>{t('moe1')}</dt>
        <dd className={s.value}>{format.number(counts.moe1)}</dd>
      </div>
      <div className={s.item}>
        <MasteryIcon aria-hidden tinted level='master' size={20} />
        <dt className={s.label}>{t('mastery')}</dt>
        <dd className={s.value}>{format.number(counts.mastery)}</dd>
      </div>
    </dl>
  );
};
