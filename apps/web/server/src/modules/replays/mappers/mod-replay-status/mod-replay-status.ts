import type { ModReplayHighlights, ModReplayStatus } from '@otmetki/schemas';

import type { ModReplayStatusRow } from '../../selects';

import { percentOf } from '../../../../common/lib';
import { replaySummarySchema } from '../../../../lib/replay';

const toCount = (value: number | null | undefined): number | null =>
  value === null || value === undefined || !Number.isFinite(value) ? null : Math.max(0, Math.round(value));

const recorderResult = (summary: unknown) => {
  const parsed = replaySummarySchema.safeParse(summary);

  return parsed.success ? (parsed.data.players.find((player) => player.isRecorder)?.result ?? null) : null;
};

const toHighlights = (row: ModReplayStatusRow): ModReplayHighlights | null => {
  const result = recorderResult(row.summary);
  const highlights = {
    accuracy: result ? percentOf({ value: result.hits, by: result.shots }) : null,
    damage: toCount(row.damageDealt ?? result?.damageDealt),
    penetrations: toCount(result?.penetrations)
  };

  return Object.values(highlights).every((value) => value === null) ? null : highlights;
};

export const toModReplayStatus = (row: ModReplayStatusRow): ModReplayStatus => ({
  id: row.id,
  status: row.status,
  highlights: row.status === 'parsed' ? toHighlights(row) : null
});
