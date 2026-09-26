'use client';

import { useTranslations } from 'next-intl';

import s from './DetailsHeaderCell.module.scss';

export const DetailsHeaderCell = () => {
  const t = useTranslations('marks.table.columns');

  return <span className={s.root}>{t('details')}</span>;
};
