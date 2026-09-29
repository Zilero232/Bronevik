import type { z } from 'zod';

import type { ReplayPacket, ReplayPlayer, TrackPoint } from '../../../../lib/replay';
import type { replayTracksSchema } from '../../dto/replays.schemas';

export type ReplayTrack = z.infer<typeof replayTracksSchema>['tracks'][number];

export type TrackSample = ReplayTrack['points'][number];

export type BuildTracksInput = {
  packets: readonly ReplayPacket[];
  players: readonly ReplayPlayer[];
  stepSeconds: number;
};

export type DownsampleInput = {
  points: readonly TrackPoint[];
  stepSeconds: number;
};
