import type { MapSummary } from '@otmetki/schemas';
import type { z } from 'zod';

import type { TacticBoard } from '@/entities/tactic/board';

import type { boardSettingsSchema } from './board-settings';

export type BoardSettingsValues = z.infer<typeof boardSettingsSchema>;

export type BoardSettingsPayload = {
  title: string;
  visibility: TacticBoard['visibility'];
  arenaId?: string;
  mode?: string;
};

export type BoardSettingsSource = Pick<TacticBoard, 'arenaId' | 'mode' | 'title' | 'visibility'>;

export type BoardMapLookupInput = {
  maps: readonly MapSummary[];
  arenaId: string | null;
};
