import type { PlayerProfile } from '@bronevik/schemas';

export type PlayerOgCardLabels = {
  eyebrow: string;
  broneIndex: string;
  winRate: string;
  battles: string;
  noClan: string;
  source: string;
};

export type PlayerOgCardProps = {
  profile: PlayerProfile;
  labels: PlayerOgCardLabels;
  host: string;
};
