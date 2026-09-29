import type { BarFillInput } from './hud-bar.types';

export const barFill = ({ value, max, width }: BarFillInput): number => (max > 0 ? Math.round(Math.min(1, Math.max(0, value / max)) * width) : 0);
