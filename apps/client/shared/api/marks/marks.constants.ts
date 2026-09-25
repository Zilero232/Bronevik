export const MOE_MOCK = {
  today: '2026-09-24',
  historyDays: 180,
  historyStep: 3,
  sparkDays: 30,
  ratios: { p65: 0.62, p85: 0.81, p95: 1, p100: 1.24 },
  mastery: { class3: 0.42, class2: 0.58, class1: 0.74, master: 0.93 },
  xpPerDamage: 0.36
} as const;

export const MOE_REQUEST = {
  pageLimit: 100,
  sparkDays: 30
} as const;
