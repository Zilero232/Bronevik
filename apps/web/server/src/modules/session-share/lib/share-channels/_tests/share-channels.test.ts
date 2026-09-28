import { describe, expect, it } from 'vitest';

import { linkedShareChannels, unlinkedChannels } from '../share-channels';

const telegram = { telegramId: 42n };
const discord = [{ accountId: '1234567890' }];

describe('linkedShareChannels', () => {
  it('lists every channel the user linked on the site', () => {
    expect(linkedShareChannels({ telegramAccount: telegram, accounts: discord })).toEqual(['telegram', 'discord']);
  });

  it('lists only what is linked', () => {
    expect(linkedShareChannels({ telegramAccount: null, accounts: discord })).toEqual(['discord']);
    expect(linkedShareChannels({ telegramAccount: telegram, accounts: [] })).toEqual(['telegram']);
  });

  it('lists nothing for an unknown user', () => {
    expect(linkedShareChannels(null)).toEqual([]);
  });
});

describe('unlinkedChannels', () => {
  it('names the requested channels that are not linked', () => {
    expect(unlinkedChannels({ requested: ['telegram', 'discord'], linked: ['telegram'] })).toEqual(['discord']);
  });

  it('is empty when every requested channel is linked', () => {
    expect(unlinkedChannels({ requested: ['discord'], linked: ['telegram', 'discord'] })).toEqual([]);
  });
});
