import type { ModeSummary } from '@otmetki/schemas';

import { PLAY_MODES } from '@otmetki/schemas';

import type { ModePanelData } from './mode-panels.types';

export const modePanels = (summaries: readonly ModeSummary[]): ModePanelData[] =>
  PLAY_MODES.map((mode) => {
    const summary = summaries.find((item) => item.mode === mode);

    return { mode, summary: summary && summary.battles > 0 ? summary : null };
  });

export const latestComputedAt = (summaries: readonly ModeSummary[]): string | null =>
  summaries.reduce<string | null>(
    (latest, { computedAt }) => (computedAt !== null && (latest === null || computedAt > latest) ? computedAt : latest),
    null
  );
