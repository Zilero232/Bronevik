import type { HudTone } from '../../../../../shared/ui/hud';

export type ArtyView = {
  level: number;
  tone: HudTone;
  counters: { key: string; icon: string; value: string; tone: HudTone }[];
  day: string | null;
  marks: number[];
};
