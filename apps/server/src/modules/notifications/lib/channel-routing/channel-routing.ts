import type { NotificationChannel } from '../../../../../generated';
import type { IsAvailableInput, RouteDigestInput, RouteEventInput, SplitChannels, SplitQuietInput } from './channel-routing.types';

import { NOTIFICATION_ROUTING } from '../../config/delivery.config';

const isAvailable = ({ channel, available }: IsAvailableInput): boolean => channel === 'site' || available[channel];

export const routeEvent = ({ event, settings, available }: RouteEventInput): NotificationChannel[] => {
  if (!settings.events.includes(event)) {
    return [];
  }

  if (event === 'sessionFinished' && !settings.sessionReport) {
    return [];
  }

  return NOTIFICATION_ROUTING.eventChannels.filter((channel) => settings.channels.includes(channel) && isAvailable({ channel, available }));
};

export const routeDigest = ({ settings, available }: RouteDigestInput): NotificationChannel[] => {
  if (!settings.weeklyDigest) {
    return [];
  }

  return NOTIFICATION_ROUTING.digestChannels.filter(
    (channel) => isAvailable({ channel, available }) && (channel === 'email' || settings.channels.includes(channel))
  );
};

export const splitQuiet = ({ channels, delayMs }: SplitQuietInput): SplitChannels => {
  if (delayMs <= 0) {
    return { now: [...channels], later: [] };
  }

  const isQuiet = (channel: NotificationChannel) => NOTIFICATION_ROUTING.quietChannels.includes(channel);

  return { now: channels.filter((channel) => !isQuiet(channel)), later: channels.filter(isQuiet) };
};
