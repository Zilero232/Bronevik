export const RATING_TIERS = ['very_bad', 'bad', 'below_avg', 'avg', 'good', 'very_good', 'great', 'unicum', 'super_unicum'] as const;

export const RATING_SCALES = {
  wn8: [0, 300, 650, 900, 1200, 1600, 2000, 2450, 2900],
  eff: [0, 450, 610, 850, 1000, 1145, 1465, 1725, 2000],
  winRate: [0, 46, 47, 48, 50, 52, 56, 60, 65],
  bronyaIndex: [0, 1500, 3000, 4500, 6000, 7500, 8500, 9300, 9800]
} as const;
