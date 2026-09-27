import type { ClanMemberEvent } from '@otmetki/schemas';

export type EventDay = {
  day: string;
  events: ClanMemberEvent[];
};

export type WeeklyMoves = {
  week: string;
  joined: number;
  left: number;
};

export type WeeklyMovesInput = {
  events: readonly ClanMemberEvent[];
  now: string;
  weeks: number;
};
