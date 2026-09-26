export type ChangeVerdict = 'buff' | 'nerf' | 'neutral';

export type ChangeVerdictInput = {
  param: string | null;
  from: number | null;
  to: number | null;
  live: number | null;
};

export type ChangeBaselineInput = Pick<ChangeVerdictInput, 'from' | 'live'>;
