import { describe, expect, it } from 'vitest';

import { toNotificationMessage } from '../notification-message';

const message = { title: 'Session summary', body: 'Tanker: 12 battles', url: 'https://triotmetki.ru/p/Tanker?session=1' };

describe('toNotificationMessage', () => {
  it('puts the title, body and link into one embed', () => {
    expect(toNotificationMessage(message).embeds?.[0]).toMatchObject({ title: message.title, description: message.body, url: message.url });
  });

  it('pings nobody, whatever the text contains', () => {
    expect(toNotificationMessage({ ...message, body: '@everyone' }).allowed_mentions).toEqual({ parse: [] });
  });

  it('leaves out a link Discord could not open', () => {
    expect(toNotificationMessage({ ...message, url: 'http://localhost:3000/p/Tanker' }).embeds?.[0]).not.toHaveProperty('url');
  });
});
