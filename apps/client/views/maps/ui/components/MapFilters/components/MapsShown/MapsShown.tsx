'use client';

import { useTranslations } from 'next-intl';

import { useMapsCatalog } from '../../../../../model/hooks';

import s from './MapsShown.module.scss';

export const MapsShown = () => {
  const t = useTranslations('maps.filters');
  const { maps, total } = useMapsCatalog();

  return (
    <span aria-live='polite' className={s.root}>
      {t('shown', { shown: maps.length, total })}
    </span>
  );
};
