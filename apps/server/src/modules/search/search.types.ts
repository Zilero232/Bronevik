import type { PlayerSearchResult, SearchKind } from '@otmetki/schemas';

export type PlayerMatchRow = {
  accountId: bigint;
  nickname: string;
  clanTag: string | null;
  matchedNickname: string | null;
  wn8: number | null;
  battles: number | null;
  score: number;
  exact: boolean;
  term: string;
};

export type ClanMatchRow = {
  clanId: bigint;
  tag: string;
  name: string;
  membersCount: number;
  emblems: unknown;
  score: number;
  exact: boolean;
};

export type TankMatchRow = {
  tankId: number;
  score: number;
  term: string;
};

export type MapMatchRow = {
  arenaId: string;
  slug: string;
  name: string;
  image: string | null;
  score: number;
};

export type TermsInput = {
  terms: string[];
  limit: number;
};

export type SearchInput = {
  q: string;
  kinds: SearchKind[] | undefined;
  limit: number;
};

export type PlayerSearchOutcome = {
  results: PlayerSearchResult[];
  term: string | null;
};
