import type { LiveState, MergeLiveInput, WentLiveInput } from './live-status.types';

export const mergeLiveStatus = ({ channels, streams }: MergeLiveInput): LiveState => {
  const live = channels.flatMap((channel) => {
    const stream = streams.find((candidate) => candidate.platform === channel.platform && candidate.handle === channel.handle.toLowerCase());

    return stream ? [stream] : [];
  });

  if (live.length === 0) {
    return { isLive: false, platform: null, viewers: null };
  }

  const top = live.reduce((best, stream) => ((stream.viewers ?? -1) > (best.viewers ?? -1) ? stream : best));

  return { isLive: true, platform: top.platform, viewers: top.viewers };
};

export const wentLive = ({ wasLive, isLive }: WentLiveInput): boolean => !wasLive && isLive;
