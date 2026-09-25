'use client';

import { Search } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Input } from '@/ui-kit';

import type { EndpointFilterProps } from './EndpointFilter.types';

import s from './EndpointFilter.module.scss';

export const EndpointFilter = ({ query, total, onQueryChange }: EndpointFilterProps) => {
  const t = useTranslations('developers.explorer');

  return (
    <div className={s.root}>
      <Input
        aria-label={t('filterLabel')}
        icon={<Search size={16} />}
        placeholder={t('filter')}
        type='search'
        value={query}
        wrapperClassName={s.input}
        onChange={(event) => onQueryChange(event.target.value)}
      />
      <span aria-live='polite' className={s.count}>
        {t('count', { count: total })}
      </span>
    </div>
  );
};
