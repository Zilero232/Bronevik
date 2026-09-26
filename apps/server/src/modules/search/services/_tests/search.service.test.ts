import { describe, expect, it } from 'vitest';
import { mock } from 'vitest-mock-extended';

import type { VehicleCatalogService } from '../../../reference';
import type { PlayerMatchRow } from '../../search.types';
import type { LocalSearchService } from '../local-search.service';
import type { PlayerDiscoveryService } from '../player-discovery.service';

import { unknownVehicle } from '../../../reference/mappers';
import { switchLayout } from '../../lib/layout-switch/layout-switch';
import { SearchService } from '../search.service';

const row = (overrides: Partial<PlayerMatchRow>): PlayerMatchRow => ({
  accountId: 1n,
  nickname: 'Tanker',
  clanTag: null,
  matchedNickname: null,
  wn8: null,
  battles: null,
  score: 0.5,
  exact: false,
  term: 'Tanker',
  ...overrides
});

const createService = () => {
  const local = mock<LocalSearchService>();
  const discovery = mock<PlayerDiscoveryService>();
  const catalog = mock<VehicleCatalogService>();

  local.players.mockResolvedValue([]);
  local.clans.mockResolvedValue([]);
  local.tanks.mockResolvedValue([]);
  local.maps.mockResolvedValue([]);
  discovery.discover.mockResolvedValue([]);
  catalog.summary.mockImplementation((tankId) => Promise.resolve(unknownVehicle(tankId)));

  return { service: new SearchService(local, discovery, catalog), local, discovery };
};

describe('SearchService.search', () => {
  it('queries only the requested kinds', async () => {
    const { service, local } = createService();

    await service.search({ q: 'IS-7', kinds: ['tank'], limit: 5 });

    expect(local.tanks).toHaveBeenCalled();
    expect(local.players).not.toHaveBeenCalled();
    expect(local.clans).not.toHaveBeenCalled();
    expect(local.maps).not.toHaveBeenCalled();
  });

  it('queries every kind when none or an empty list is requested', async () => {
    const { service, local } = createService();

    await service.search({ q: 'abc', kinds: [], limit: 5 });

    expect(local.players).toHaveBeenCalled();
    expect(local.maps).toHaveBeenCalled();
  });

  it('skips Lesta when the best local player is an exact match', async () => {
    const { service, local, discovery } = createService();

    local.players.mockResolvedValue([row({ exact: true })]);

    const response = await service.search({ q: 'Tanker', kinds: ['player'], limit: 5 });

    expect(discovery.discover).not.toHaveBeenCalled();
    expect(response.correctedQuery).toBeNull();
  });

  it('reports the layout-corrected query when the match came from a switched layout', async () => {
    const { service, local } = createService();
    const typed = switchLayout('Tanker');

    local.players.mockResolvedValue([row({ exact: true, term: 'Tanker' })]);

    const response = await service.search({ q: typed, kinds: ['player'], limit: 5 });

    expect(response.query).toBe(typed);
    expect(response.correctedQuery).toBe('Tanker');
  });

  it('puts an exact Lesta nickname first and removes duplicates of local rows', async () => {
    const { service, local, discovery } = createService();

    local.players.mockResolvedValue([row({ accountId: 1n, nickname: 'Tankerman' }), row({ accountId: 2n, nickname: 'Tanker2' })]);

    discovery.discover.mockResolvedValue([
      { account_id: 2, nickname: 'Tanker2' },
      { account_id: 3, nickname: 'Tanker' }
    ]);

    const response = await service.search({ q: 'tanker', kinds: ['player'], limit: 5 });

    expect(response.results.map((result) => (result.kind === 'player' ? result.accountId : null))).toEqual([3, 1, 2]);
    expect(response.correctedQuery).toBe(null);
  });

  it('respects the limit after merging local and Lesta players', async () => {
    const { service, discovery } = createService();

    discovery.discover.mockResolvedValue([
      { account_id: 1, nickname: 'a1' },
      { account_id: 2, nickname: 'a2' },
      { account_id: 3, nickname: 'a3' }
    ]);

    const response = await service.search({ q: 'aaa', kinds: ['player'], limit: 2 });

    expect(response.results).toHaveLength(2);
  });

  it('drops map images that are not valid URLs', async () => {
    const { service, local } = createService();

    local.maps.mockResolvedValue([
      { arenaId: 'a', slug: 'a', name: 'A', image: 'not a url', score: 1 },
      { arenaId: 'b', slug: 'b', name: 'B', image: 'https://example.com/b.png', score: 1 }
    ]);

    const response = await service.search({ q: 'map', kinds: ['map'], limit: 5 });

    expect(response.results).toEqual([
      expect.objectContaining({ kind: 'map', arenaId: 'a', image: null }),
      expect.objectContaining({ kind: 'map', arenaId: 'b', image: 'https://example.com/b.png' })
    ]);
  });
});
