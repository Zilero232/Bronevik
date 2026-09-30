'use client';

import { useFormatter, useLocale, useTranslations } from 'next-intl';

import type { ModpackChangelog } from '@/shared/api/generated';

import { useModpackChangelog } from '@/entities/mod/modpack-release';

import type { ModRelease } from './use-mod-changelog.types';

import { MOD_PAGE } from '../../../config';
import { gameLabel, parseReleaseNotes } from '../../../lib/release-notes';
import { isBaseId, isShowcaseId } from '../../../lib/showcase';

export const useModChangelog = () => {
  const t = useTranslations('mod.showcase');
  const locale = useLocale();
  const format = useFormatter();
  const { data, isError, isRefetching, refetch } = useModpackChangelog(MOD_PAGE.changelogLimit);

  const titleOf = (id: string): string => {
    if (isShowcaseId(id)) {
      return t(`components.${id}.title`);
    }

    return isBaseId(id) ? t(`base.${id}`) : id;
  };

  const toRelease = (release: ModpackChangelog['releases'][number]): ModRelease => ({
    ...parseReleaseNotes(release.notes?.[locale]),
    version: release.version,
    date: format.dateTime(new Date(release.publishedAt), { dateStyle: 'long' }),
    dateTime: release.publishedAt,
    games: release.games.map(gameLabel).join(', '),
    changed: release.changes.map((change) => titleOf(change.id))
  });

  return {
    query: { data: data?.releases.map(toRelease), isError, isRefetching, refetch }
  };
};
