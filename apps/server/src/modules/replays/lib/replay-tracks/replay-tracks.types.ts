import type { ReplayPacket, ReplayPlayer, TrackPoint } from '../../../../lib/replay';

export type TrackSample = [time: number, x: number, z: number];

export type ReplayTrack = {
  vehicleId: number;
  accountId: number | null;
  name: string;
  team: number;
  tankId: number | null;
  vehicleType: string | null;
  points: TrackSample[];
};

export type BuildTracksInput = {
  packets: readonly ReplayPacket[];
  players: readonly ReplayPlayer[];
  stepSeconds: number;
};

export type DownsampleInput = {
  points: readonly TrackPoint[];
  stepSeconds: number;
};
