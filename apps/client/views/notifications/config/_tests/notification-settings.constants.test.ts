import { notificationChannelSchema, notificationEventSchema } from '@otmetki/schemas';
import { describe, expect, it } from 'vitest';

import { EVENT_GROUPS, NOTIFICATION_CHANNELS } from '../notification-settings.constants';

describe('EVENT_GROUPS', () => {
  it('offers a toggle for every notification event exactly once', () => {
    const grouped: string[] = Object.values(EVENT_GROUPS).flat();

    expect([...grouped].sort()).toEqual([...notificationEventSchema.options].sort());
  });
});

describe('NOTIFICATION_CHANNELS', () => {
  it('offers every delivery channel exactly once', () => {
    expect(NOTIFICATION_CHANNELS.map(({ channel }) => channel).sort()).toEqual([...notificationChannelSchema.options].sort());
  });
});
