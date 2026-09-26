import type { StreamerChannel } from '@otmetki/schemas';

import type { StreamerProfile } from '@/entities/streamer/streamer';

export type StreamerHeroProps = {
  profile: StreamerProfile;
  channels: StreamerChannel[];
};
