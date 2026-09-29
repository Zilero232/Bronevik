'use client';

import { useTranslations } from 'next-intl';

import { useMapsCatalog } from '../../../../../model/hooks';

import s from './MapsShown.module.scss';

export const MapsShown = () => {
  const t = useTranslations('maps.filters');
  const { query } = useMapsCatalog();

  return (
    <span aria-live='polite' className={s.root}>
      {query.data && query.data.total > 0 && t('shown', { shown: query.data.maps.length, total: query.data.total })}
    </span>
  );
};
