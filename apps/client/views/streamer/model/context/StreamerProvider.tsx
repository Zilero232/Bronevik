'use client';

import { channelLinks } from '@/entities/streamer/channel';

import type { StreamerProviderProps } from './StreamerProvider.types';

import { StreamerContext } from './streamer-context';

export const StreamerProvider = ({ profile, children }: StreamerProviderProps) => (
  <StreamerContext value={{ profile, channels: channelLinks(profile.channels) }}>{children}</StreamerContext>
);
