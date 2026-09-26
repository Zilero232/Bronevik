export type FrontlineValues = {
  level: number | null;
  levelXp: number | null;
  battleXp: number | null;
  prestige: number | null;
  targetPrestige: number | null;
  battlesPerDay: number;
};

export type FrontlineResultItem = {
  key: string;
  label: string;
  value: string;
  tone?: 'bad' | 'good' | 'neutral';
};
