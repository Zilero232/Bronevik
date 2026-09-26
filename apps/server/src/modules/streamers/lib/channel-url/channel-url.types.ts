import type { StreamerPlatform } from '@otmetki/schemas';

export type ParseChannelInput = {
  platform: StreamerPlatform;
  url: string;
};

export type ParsedChannel = {
  platform: StreamerPlatform;
  handle: string;
  url: string;
};

export type HandleOfInput = {
  platform: StreamerPlatform;
  url: URL;
};
