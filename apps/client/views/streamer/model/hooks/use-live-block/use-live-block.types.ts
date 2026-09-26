import type { StreamerChannel, StreamerLive } from '@otmetki/schemas';

export type UseLiveBlockInput = {
  live: StreamerLive;
  channels: readonly StreamerChannel[];
};
