'use client';

import type { SettingsValues } from '@otmetki/schemas';

import { diffSettings, STREAMER_SETTINGS } from '@otmetki/schemas';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { match } from 'ts-pattern';

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
  const {
    data: compared,
    isError: isCompareError,
    isRefetching: isCompareRefetching,
    refetch: refetchCompare
  } = useQuery(settingsCompareQueries.bySlugs(slugs));

  const {
    data: share,
    isSuccess: isShareReady,
    isError: isShareError,
    isRefetching: isShareRefetching,
    refetch: refetchShare
  } = useQuery({ queryKey: QUERY_KEYS.me.streamer.settingsShare, queryFn: getSettingsShare, enabled: isSignedIn && isMine });

  const views = slugs.flatMap((slug) => compared?.filter((view) => view.slug.toLowerCase() === slug) ?? []);
  const mine: SettingsValues | null = isMine ? (share?.values ?? null) : null;
  const columns: CompareColumn[] = [
    ...views.map((view) => ({ id: view.slug, label: view.displayName, slug: view.slug })),
    ...(mine ? [{ id: 'me', label: t('mine'), slug: null }] : [])
  ];

  const isComparable = columns.length >= STREAMER_SETTINGS.compareMin;

  return {
    columns,
    isComparable,
    isShareMissing: isMine && isSignedIn && isShareReady && share === null,
    query: {
      data: match({ isLoaded: slugs.length === 0 || compared !== undefined, isComparable })
        .with({ isLoaded: false }, () => undefined)
        .with({ isComparable: false }, () => [])
        .otherwise(() => compareSections(diffSettings([...views.map(({ settings }) => settings), ...(mine ? [mine] : [])]))),
      isError: isCompareError || isShareError,
      isRefetching: isCompareRefetching || isShareRefetching,
      refetch: () => {
        void refetchCompare();

        if (isMine) {
          void refetchShare();
        }
      }
    }
  };
};
