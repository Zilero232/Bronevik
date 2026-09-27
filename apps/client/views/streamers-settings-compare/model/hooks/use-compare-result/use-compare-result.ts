'use client';

import type { SettingsValues } from '@otmetki/schemas';

import { diffSettings, STREAMER_SETTINGS } from '@otmetki/schemas';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';

import { useAuthSession } from '@/entities/auth/session';
import { getSettingsShare } from '@/entities/streamer/streamer';
import { QUERY_KEYS } from '@/shared/constants';

import type { CompareColumn } from './use-compare-result.types';

import { settingsCompareQueries } from '../../../api';
import { compareSections } from '../../../lib/compare-sections';
import { useCompareParams } from '../use-compare-params';

export const useCompareResult = () => {
  const t = useTranslations('streamerSettings.compare');
  const { slugs, isMine } = useCompareParams();
  const { data: session } = useAuthSession();
  const isSignedIn = Boolean(session);
  const compare = useQuery(settingsCompareQueries.bySlugs(slugs));
  const share = useQuery({ queryKey: QUERY_KEYS.me.streamer.settingsShare, queryFn: getSettingsShare, enabled: isSignedIn && isMine });

  const views = slugs.flatMap((slug) => compare.data?.filter((view) => view.slug.toLowerCase() === slug) ?? []);
  const mine: SettingsValues | null = isMine ? (share.data?.values ?? null) : null;
  const columns: CompareColumn[] = [
    ...views.map((view) => ({ id: view.slug, label: view.displayName, slug: view.slug })),
    ...(mine ? [{ id: 'me', label: t('mine'), slug: null }] : [])
  ];

  const isComparable = columns.length >= STREAMER_SETTINGS.compareMin;

  return {
    columns,
    isComparable,
    isShareMissing: isMine && isSignedIn && share.isSuccess && share.data === null,
    query: {
      data:
        slugs.length === 0 || compare.data
          ? isComparable
            ? compareSections(diffSettings([...views.map(({ settings }) => settings), ...(mine ? [mine] : [])]))
            : []
          : undefined,
      isError: compare.isError || share.isError,
      isRefetching: compare.isRefetching || share.isRefetching,
      refetch: () => {
        void compare.refetch();

        if (isMine) {
          void share.refetch();
        }
      }
    }
  };
};
