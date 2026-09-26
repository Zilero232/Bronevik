import { describe, expect, it } from 'vitest';

import { botRows } from '../bot-rows';

const OFF = {
  discord: { enabled: false, linkEnabled: false, inviteUrl: null, accountId: null },
  vk: { enabled: false, linkEnabled: false, botUrl: null, miniAppUrl: null, accountId: null }
};

describe('botRows', () => {
  it('marks platforms the server has not configured as unavailable', () => {
    expect(botRows(OFF).map(({ isAvailable, links }) => ({ isAvailable, links }))).toEqual([
      { isAvailable: false, links: [] },
      { isAvailable: false, links: [] }
    ]);
  });

  it('lists the invite, bot and mini app links that exist', () => {
    const rows = botRows({
      discord: { enabled: true, linkEnabled: true, inviteUrl: 'https://discord.com/oauth2/authorize?client_id=1', accountId: '42' },
      vk: { enabled: true, linkEnabled: false, botUrl: 'https://vk.me/club1', miniAppUrl: 'https://vk.com/app2', accountId: null }
    });

    expect(rows[0]).toMatchObject({ provider: 'discord', accountId: '42', canLink: true, links: [{ key: 'invite' }] });
    expect(rows[1]).toMatchObject({ provider: 'vk', canLink: false, isAvailable: true, links: [{ key: 'bot' }, { key: 'miniApp' }] });
  });
});
