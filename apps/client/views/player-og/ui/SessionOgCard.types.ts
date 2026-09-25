import type { Session } from '@bronevik/schemas';

export type SessionOgCardLabels = {
  eyebrow: string;
  date: string;
  battles: string;
  winRate: string;
  avgDamage: string;
  best: string;
};

export type SessionOgCardProps = {
  nickname: string;
  session: Session;
  labels: SessionOgCardLabels;
};
