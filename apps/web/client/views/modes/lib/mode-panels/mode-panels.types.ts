import type { ModeSummary, PlayMode } from '@otmetki/schemas';

export type ModePanelData = {
  mode: PlayMode;
  summary: ModeSummary | null;
};
