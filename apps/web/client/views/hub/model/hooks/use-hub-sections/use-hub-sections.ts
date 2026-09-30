'use client';

import type { ChangeEvent } from 'react';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { SITE_HUB_GROUPS } from '@/shared/constants';

import { filterHubSections } from '../../../lib/hub-filter';

export const useHubSections = () => {
  const t = useTranslations('nav');
  const [query, setQuery] = useState('');

  const sections = filterHubSections({
    sections: SITE_HUB_GROUPS.map((group) => ({
      key: group.key,
      title: t(`groups.${group.key}`),
      items: group.items.map((item) => ({ ...item, label: t(`items.${item.key}`), hint: t(`hints.${item.key}`) }))
    })),
    query
  });

  return {
    query,
    sections,
    isFiltered: query.trim().length > 0,
    onQueryChange: (event: ChangeEvent<HTMLInputElement>) => setQuery(event.target.value),
    onReset: () => setQuery('')
  };
};
