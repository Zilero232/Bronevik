import { plusLimit } from '@otmetki/schemas';

export const FOLLOW_STREAMER = {
  iconSize: 15,
  freeLimit: plusLimit({ key: 'streamerFollows', isPlus: false })
} as const;
