import { useState } from 'react';
import { useLocale, useTranslations } from 'use-intl';

import { previewSrc, useCatalog } from '@/entities/catalog';
import { useSelectedClient } from '@/entities/client';
import { useInstallation } from '@/entities/installation';
import { pickLocalized, useNavigation } from '@/shared/lib';

import { COMPONENT_CATALOG } from '../../../config';
import { buildCatalogRows, filterCatalogRows } from '../../../lib';

export const useComponentCatalog = () => {
  const t = useTranslations('components');
  const locale = useLocale();
  const { navigate } = useNavigation();
  const { clientPath } = useSelectedClient();
  const catalogQuery = useCatalog();
  const { data: installation } = useInstallation(clientPath);
  const [category, setCategory] = useState<string>(COMPONENT_CATALOG.allCategories);
  const [query, setQuery] = useState('');
  const [lightOnly, setLightOnly] = useState(false);

  const catalog = catalogQuery.data ?? null;
  const rows = catalog ? buildCatalogRows({ catalog, installation: installation ?? null, locale }) : [];
  const visible = filterCatalogRows({ rows, category, query, lightOnly });
  const chips = [
    { value: COMPONENT_CATALOG.allCategories, label: t('allCategories'), count: rows.length },
    ...(catalog?.categories ?? []).map((item) => ({
      value: item.id,
      label: pickLocalized({ text: item.title, locale }),
      count: rows.filter((row) => row.category === item.id).length
    }))
  ];

  return {
    catalogQuery,
    clientPath,
    isInstalled: installation?.installed ?? false,
    hasComponents: rows.length > 0,
    chips,
    presets: (catalog?.presets ?? [])
      .filter((preset) => !preset.custom)
      .map((preset) => ({ id: preset.id, title: pickLocalized({ text: preset.title, locale }) })),
    category,
    query,
    lightOnly,
    rows: visible.map((row) => ({
      ...row,
      previewSrc: previewSrc({ previewsDir: catalog?.previewsDir ?? null, file: row.image }),
      audioSrc: previewSrc({ previewsDir: catalog?.previewsDir ?? null, file: row.audio })
    })),
    onCategoryChange: setCategory,
    onApplyPreset: (preset: string) => navigate({ page: 'install', params: { preset } }),
    onInstall: () => navigate({ page: 'install' }),
    onQueryChange: setQuery,
    onLightOnlyChange: setLightOnly
  };
};
