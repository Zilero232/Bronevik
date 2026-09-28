export const USAGE_AUDIENCES = ['anonymous', 'free', 'plus'] as const;

export const USAGE_METERS = {
  armor3d: { feature: 'armor3d', anonymous: 3, free: 15, plus: null },
  battleAnalysis: { feature: 'battleAnalysis', anonymous: 0, free: 3, plus: null }
} as const;

export const USAGE_METER_KEYS = ['armor3d', 'battleAnalysis'] as const;
