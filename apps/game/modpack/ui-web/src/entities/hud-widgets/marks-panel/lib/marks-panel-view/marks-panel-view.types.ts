import type { HudTone } from '../../../../../shared/ui/hud';

export type LevelNeedView = { level: number; label: string; value: string; reached: boolean };

export type MarksPanelView = {
  text: string | null;
  mark: string;
  approx: boolean;
  percent: string;
  tone: HudTone;
  delta: string | null;
  deltaTone: HudTone;
  goal: LevelNeedView | null;
  thresholds: LevelNeedView[];
  step: string | null;
  average: { label: string; value: string } | null;
  battles: { label: string; value: string } | null;
  note: string | null;
};
