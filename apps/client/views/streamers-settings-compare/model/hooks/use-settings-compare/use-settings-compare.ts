'use client';

import type { SettingsValues } from '@otmetki/schemas';

import { diffSettings, STREAMER_SETTINGS } from '@otmetki/schemas';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useQueryStates } from 'nuqs';

import { useAuthSession } from '@/entities/auth/session';
import { compareStreamerSettings, getSettingsShare, getSettingsTable } from '@/shared/api/streamers';
import { QUERY_KEYS } from '@/shared/constants';

import type { CompareColumn } from './use-settings-compare.types';

import { COMPARE_SETTINGS_PAGE, COMPARE_SETTINGS_PARAMS } from '../../../config';
import { compareSections } from '../../../lib/compare-sections';
import { compareSlugs, slotValues, withoutSlug, withSlug } from '../../../lib/compare-slugs';

export const useSettingsCompare = () => {
  const t = useTranslations('streamerSettings.compare');
  const [params, setParams] = useQueryStates(COMPARE_SETTINGS_PARAMS, { history: 'replace' });
  const { data: session } = useAuthSession();
  const isSignedIn = Boolean(session);
  const slugs = compareSlugs(params);
  const table = useQuery({ queryKey: QUERY_KEYS.streamers.settingsTable, queryFn: getSettingsTable });
  const compare = useQuery({
    queryKey: QUERY_KEYS.streamers.settingsCompare(slugs),
    queryFn: () => compareStreamerSettings(slugs),
    enabled: slugs.length > 0,
    placeholderData: keepPreviousData
  });

  const share = useQuery({
    queryKey: QUERY_KEYS.me.streamer.settingsShare,
    queryFn: getSettingsShare,
    enabled: isSignedIn && params.me
  });

  const views = slugs.flatMap((slug) => compare.data?.filter((view) => view.slug.toLowerCase() === slug) ?? []);
  const mine: SettingsValues | null = params.me ? (share.data?.values ?? null) : null;
  const columns: CompareColumn[] = [
    ...views.map((view) => ({ id: view.slug, label: view.displayName, slug: view.slug })),
    ...(mine ? [{ id: 'me', label: t('mine'), slug: null }] : [])
  ];

  const sections =
    columns.length >= STREAMER_SETTINGS.compareMin
      ? compareSections(diffSettings([...views.map(({ settings }) => settings), ...(mine ? [mine] : [])]))
      : [];

  const picked = new Set(slugs);

  const setSlugs = (next: readonly string[]) => void setParams(slotValues(next));

  return {
    slugs,
    columns,
    sections,
    isMine: params.me,
    isSignedIn,
    isShareMissing: params.me && isSignedIn && share.isSuccess && share.data === null,
    canAdd: slugs.length < STREAMER_SETTINGS.compareMax,
    addItems: [
      { value: COMPARE_SETTINGS_PAGE.addValue, label: t('add') },
      ...(table.data ?? []).filter((row) => !picked.has(row.slug.toLowerCase())).map((row) => ({ value: row.slug, label: row.displayName }))
    ],
    picked: slugs.map((slug) => ({ slug, label: views.find((view) => view.slug.toLowerCase() === slug)?.displayName ?? slug })),
    isPending: slugs.length > 0 && compare.isPending,
    isError: compare.isError || share.isError,
    isRetrying: compare.isRefetching || share.isRefetching,
    retry: () => {
      void compare.refetch();

      if (params.me) {
        void share.refetch();
      }
    },
    onAdd: (slug: string) => {
      if (slug !== COMPARE_SETTINGS_PAGE.addValue) {
        setSlugs(withSlug({ slugs, slug }));
      }
    },
    onRemove: (slug: string) => setSlugs(withoutSlug({ slugs, slug })),
    onMineChange: (me: boolean) => void setParams({ me: me || null })
  };
};
