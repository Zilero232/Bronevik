export const ACTIVITY_STATUSES = ['active', 'recent', 'idle', 'gone'] as const;

export const ACTIVITY_LIMITS = {
  active: 1,
  recent: 7,
  idle: 30
} as const;
