import type { HudTone } from '../../../../../shared/ui/hud';

export type MarksPanelView = {
  extended: boolean;
  mark: string;
  percent: string;
  delta: string | null;
  deltaTone: HudTone;
  thresholds: { level: number; label: string; value: string; reached: boolean }[];
  step: string | null;
  battles: string | null;
};
