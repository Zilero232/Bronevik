import type { PlayerSearchResult, SearchResponse, SearchResult } from '@otmetki/schemas';

import { Injectable } from '@nestjs/common';
import { uniqueBy } from 'remeda';

import type { PlayerSearchOutcome, SearchInput, TermsInput } from '../search.types';

import { VehicleCatalogService } from '../../reference';
import { searchCandidates } from '../lib';
import { toClanSearchResult, toDiscoveredPlayerResult, toMapSearchResult, toPlayerSearchResult } from '../mappers';
import { LocalSearchService } from './local-search.service';
import { PlayerDiscoveryService } from './player-discovery.service';

@Injectable()
export class SearchService {
  constructor(
    private readonly local: LocalSearchService,
    private readonly discovery: PlayerDiscoveryService,
    private readonly catalog: VehicleCatalogService
  ) {}

  async search({ q, kinds, limit }: SearchInput): Promise<SearchResponse> {
    const wants = (kind: SearchResult['kind']) => !kinds || kinds.length === 0 || kinds.includes(kind);
    const candidates = searchCandidates(q);

    const [players, clans, tanks, maps] = await Promise.all([
      wants('player') ? this.players({ terms: candidates.nicknames, limit }) : Promise.resolve({ results: [], term: null }),
      wants('clan') ? this.local.clans({ terms: candidates.all, limit }) : Promise.resolve([]),
      wants('tank') ? this.local.tanks({ terms: candidates.all, limit }) : Promise.resolve([]),
      wants('map') ? this.local.maps({ terms: candidates.all, limit }) : Promise.resolve([])
    ]);

    const tankResults = await Promise.all(tanks.map(async (row) => ({ kind: 'tank' as const, vehicle: await this.catalog.summary(row.tankId) })));

    const results: SearchResult[] = [...players.results, ...clans.map(toClanSearchResult), ...tankResults, ...maps.map(toMapSearchResult)];

    return { query: q, correctedQuery: players.term && players.term !== q ? players.term : null, results };
  }

  private async players({ terms, limit }: TermsInput): Promise<PlayerSearchOutcome> {
    const rows = await this.local.players({ terms, limit });

    const local: PlayerSearchResult[] = rows.map(toPlayerSearchResult);

    const best = rows[0];

    if (best?.exact) {
      return { results: local, term: best.term };
    }

    const discovered = await this.discovery.discover(terms);

    const remote: PlayerSearchResult[] = discovered.map(toDiscoveredPlayerResult);

    const exactRemote = remote.filter((item) => terms.some((term) => term.toLowerCase() === item.nickname.toLowerCase()));
    const merged = uniqueBy([...exactRemote, ...local, ...remote], (item) => item.accountId).slice(0, limit);
    const term = exactRemote[0]
      ? (terms.find((candidate) => candidate.toLowerCase() === exactRemote[0]?.nickname.toLowerCase()) ?? null)
      : (best?.term ?? null);

    return { results: merged, term };
  }
}
