import type { PlayerSummary } from '@bronevik/schemas';

export type PlayerHeaderProps = {
  nickname: string;
  summary: PlayerSummary | undefined;
};
