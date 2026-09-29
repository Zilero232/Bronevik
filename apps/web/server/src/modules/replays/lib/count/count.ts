export const toCount = (value: number | null | undefined): number | null =>
  value === null || value === undefined || !Number.isFinite(value) ? null : Math.max(0, Math.round(value));
