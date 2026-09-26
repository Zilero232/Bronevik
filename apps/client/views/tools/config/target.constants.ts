export const TARGET_METRICS = ['winRate', 'avgDamage', 'wn8'] as const;

export type TargetMetric = (typeof TARGET_METRICS)[number];

export const TARGET = {
  valueFields: ['current', 'expected', 'target'],
  curvePoints: 40,
  curveOvershoot: 1.25,
  battlesRange: { min: 0, max: 200_000, step: 100 },
  metrics: {
    winRate: { min: 0, max: 100, step: 0.01, digits: 2, suffix: '%', defaults: { current: 49.2, expected: 55, target: 50 } },
    avgDamage: { min: 0, max: 10_000, step: 10, digits: 0, suffix: '', defaults: { current: 1_350, expected: 2_200, target: 1_500 } },
    wn8: { min: 0, max: 6_000, step: 10, digits: 0, suffix: '', defaults: { current: 1_100, expected: 2_000, target: 1_400 } }
  },
  defaults: { battles: 18_000, metric: 'winRate' }
} as const;
