export type PlayerIdentityData = {
  nickname: string;
  clanTag: string | null;
};

export type PlayerStats = PlayerIdentityData & {
  id: number;
  battles: number;
  winRate: number;
  wn8: number;
  avgDamage: number;
  broneIndex: number;
  marks3: number;
  trend: number[];
};
