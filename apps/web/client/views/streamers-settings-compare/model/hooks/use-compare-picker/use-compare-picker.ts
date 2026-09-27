'use client';

import { STREAMER_SETTINGS } from '@otmetki/schemas';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';

import { useAuthSession } from '@/entities/auth/session';
import { getSettingsTable } from '@/entities/streamer/streamer';
import { QUERY_KEYS } from '@/shared/constants';

import { settingsCompareQueries } from '../../../api';
import { COMPARE_SETTINGS_PAGE } from '../../../config';
import { withoutSlug, withSlug } from '../../../lib/compare-slugs';
import { useCompareParams } from '../use-compare-params';

export const useComparePicker = () => {
  const t = useTranslations('streamerSettings.compare');
  const { slugs, isMine, setSlugs, onMineChange } = useCompareParams();
  const { data: session } = useAuthSession();
  const table = useQuery({ queryKey: QUERY_KEYS.streamers.settingsTable, queryFn: getSettingsTable });
  const compare = useQuery(settingsCompareQueries.bySlugs(slugs));

  return {
    isMine,
    isSignedIn: Boolean(session),
    canAdd: slugs.length < STREAMER_SETTINGS.compareMax,
    addItems: [
      { value: COMPARE_SETTINGS_PAGE.addValue, label: t('add') },
      ...(table.data ?? []).filter((row) => !slugs.includes(row.slug.toLowerCase())).map((row) => ({ value: row.slug, label: row.displayName }))
    ],
    picked: slugs.map((slug) => ({ slug, label: compare.data?.find((view) => view.slug.toLowerCase() === slug)?.displayName ?? slug })),
    onAdd: (slug: string) => {
      if (slug !== COMPARE_SETTINGS_PAGE.addValue) {
        setSlugs(withSlug({ slugs, slug }));
      }
    },
    onRemove: (slug: string) => setSlugs(withoutSlug({ slugs, slug })),
    onMineChange
  };
};
