import { ChartColumn, Cpu, Crosshair, Layers, Puzzle, Warehouse } from 'lucide-react';

export const PERF = {
  tones: { low: 'success', medium: 'warning', high: 'danger' },
  light: 'low'
} as const;

export const PREVIEW = {
  categories: {
    core: { icon: Cpu, tone: 'accent' },
    base: { icon: Layers, tone: 'accent' },
    battle: { icon: Crosshair, tone: 'battle' },
    hangar: { icon: Warehouse, tone: 'hangar' },
    data: { icon: ChartColumn, tone: 'data' }
  },
  fallback: { icon: Puzzle, tone: 'neutral' }
} as const;
