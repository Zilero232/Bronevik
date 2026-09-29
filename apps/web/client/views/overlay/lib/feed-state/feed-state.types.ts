import type { OverlayData } from '@/entities/streamer/streamer';

type FeedTransport = 'polling' | 'stream';

export type FeedState = {
  transport: FeedTransport;
  data: OverlayData | null;
};

export type FeedEvent = { type: 'error' } | { type: 'message'; payload: string };
