import type { PlayerProfile } from '@bronevik/schemas';

export type MarksSummaryProps = {
  counts: Pick<PlayerProfile['summary']['marks'], 'mastery' | 'moe1' | 'moe2' | 'moe3'>;
};
