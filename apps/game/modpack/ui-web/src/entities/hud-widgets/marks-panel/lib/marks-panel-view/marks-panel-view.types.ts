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
  up: { label: string; value: string; reached: boolean } | null;
  source: { label: string; tone: HudTone } | null;
  detail: { label: string; average: string; target: string | null } | null;
};
