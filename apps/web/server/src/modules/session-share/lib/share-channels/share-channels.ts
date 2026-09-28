import type { ShareChannel } from '../../../../../generated';
import type { LinkedChannelsSource, UnlinkedChannelsInput } from './share-channels.types';

export const linkedShareChannels = (recipient: LinkedChannelsSource | null): ShareChannel[] => {
  if (!recipient) {
    return [];
  }

  return [...(recipient.telegramAccount ? (['telegram'] as const) : []), ...(recipient.accounts.length > 0 ? (['discord'] as const) : [])];
};

export const unlinkedChannels = ({ requested, linked }: UnlinkedChannelsInput): ShareChannel[] =>
  requested.filter((channel) => !linked.includes(channel));
