import { nicknameSchema } from '@otmetki/schemas';

import type { ReplaySearchQuery } from '@/entities/replay/replay';

import type { PageWindow, PageWindowInput, ReplayFilters, ToSearchQueryInput } from './replay-query.types';

import { REPLAY_LIST } from '../../config';

const slugOrUndefined = (value: string | null): string | undefined => (value !== null && REPLAY_LIST.slugPattern.test(value) ? value : undefined);

export const playerQuery = (player: string): string | undefined => {
  const parsed = nicknameSchema.safeParse(player);

  return parsed.success ? parsed.data : undefined;
};

export const toSearchQuery = ({ filters, limit }: ToSearchQueryInput): ReplaySearchQuery => ({
  sort: filters.sort,
  limit,
  offset: Math.max(0, filters.offset),
  tankId: filters.tank !== null && filters.tank > 0 ? filters.tank : undefined,
  arenaId: slugOrUndefined(filters.map),
  mode: slugOrUndefined(filters.mode),
  player: playerQuery(filters.player),
  result: filters.result ?? undefined
});

export const hasActiveFilters = (filters: ReplayFilters): boolean =>
  filters.tank !== null || filters.map !== null || filters.mode !== null || filters.result !== null || filters.player.trim().length > 0;

export const pageWindow = ({ offset, limit, total }: PageWindowInput): PageWindow => {
  const pages = Math.max(1, Math.ceil(total / limit));
  const page = Math.min(pages, Math.floor(offset / limit) + 1);

  return {
    page,
    pages,
    prevOffset: offset > 0 ? Math.max(0, offset - limit) : null,
    nextOffset: offset + limit < total ? offset + limit : null
  };
};

export const toSelectValue = (value: string | null): string => value ?? REPLAY_LIST.anyValue;

export const fromSelectValue = (value: string): string | null => (value === REPLAY_LIST.anyValue ? null : value);
