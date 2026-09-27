import type { PlayerSummary } from '@otmetki/schemas';

export type PlayerHeaderProps = {
  nickname: string;
  summary: PlayerSummary | undefined;
};
