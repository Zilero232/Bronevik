import { Castle, ChartSpline, FileDown, History, MonitorPlay, Radar } from 'lucide-react';

export const PLUS_BENEFITS = [
  { id: 'history', icon: History },
  { id: 'charts', icon: ChartSpline },
  { id: 'overlays', icon: MonitorPlay },
  { id: 'polling', icon: Radar },
  { id: 'export', icon: FileDown },
  { id: 'clan', icon: Castle }
] as const;
