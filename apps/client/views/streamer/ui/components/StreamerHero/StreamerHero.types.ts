import type { StreamerChannel } from '@otmetki/schemas';

import type { StreamerProfile } from '@/shared/api/streamers';

export type StreamerHeroProps = {
  profile: StreamerProfile;
  channels: StreamerChannel[];
};
