import type { StreamerChannel, StreamerLive } from '@otmetki/schemas';

export type LiveBlockProps = {
  live: StreamerLive;
  channels: StreamerChannel[];
};
