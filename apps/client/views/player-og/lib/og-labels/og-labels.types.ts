export type PlayerOgLabels = {
  kind: string;
  broneIndex: string;
  winRate: string;
  battles: string;
  noClan: string;
  source: string;
};

export type SessionOgLabels = {
  kind: string;
  battles: string;
  winRate: string;
  avgDamage: string;
  best: string;
  source: string;
};

export type WrappedOgLabels = {
  kind: string;
  year: string;
  battles: string;
  winRate: string;
  avgDamage: string;
  marks: string;
  source: string;
};

export type OgLabels = {
  brand: string;
  fallback: string;
  player: PlayerOgLabels;
  session: SessionOgLabels;
  wrapped: WrappedOgLabels;
};
