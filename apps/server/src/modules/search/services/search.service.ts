import type { PlayerSearchResult, SearchResponse, SearchResult } from '@bronevik/schemas';

import { Injectable } from '@nestjs/common';
import { uniqueBy } from 'remeda';

import type { PlayerSearchOutcome, SearchInput, TermsInput } from '../search.types';

import { clanEmblem, emptyRating, ratingValue, toNumber } from '../../../common/lib';
import { VehicleCatalogService } from '../../reference';
import { searchCandidates } from '../lib';
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

    const results: SearchResult[] = [
      ...players.results,
      ...clans.map((row) => ({
        kind: 'clan' as const,
        clanId: toNumber(row.clanId),
        tag: row.tag,
        name: row.name,
        membersCount: row.membersCount,
        emblem: clanEmblem(row.emblems)
      })),
      ...tankResults,
      ...maps.map((row) => ({
        kind: 'map' as const,
        arenaId: row.arenaId,
        slug: row.slug,
        name: row.name,
        image: row.image && URL.canParse(row.image) ? row.image : null
      }))
    ];

    return { query: q, correctedQuery: players.term && players.term !== q ? players.term : null, results };
  }

  private async players({ terms, limit }: TermsInput): Promise<PlayerSearchOutcome> {
    const rows = await this.local.players({ terms, limit });

    const local: PlayerSearchResult[] = rows.map((row) => ({
      kind: 'player',
      accountId: toNumber(row.accountId),
      nickname: row.nickname,
      clanTag: row.clanTag,
      matchedNickname: row.matchedNickname,
      wn8: ratingValue({ kind: 'wn8', value: row.wn8 }),
      battles: row.battles
    }));

    const best = rows[0];

    if (best?.exact) {
      return { results: local, term: best.term };
    }

    const discovered = await this.discovery.discover(terms);

    const remote: PlayerSearchResult[] = discovered.map((item) => ({
      kind: 'player',
      accountId: item.account_id,
      nickname: item.nickname,
      clanTag: null,
      matchedNickname: null,
      wn8: emptyRating(),
      battles: null
    }));

    const exactRemote = remote.filter((item) => terms.some((term) => term.toLowerCase() === item.nickname.toLowerCase()));
    const merged = uniqueBy([...exactRemote, ...local, ...remote], (item) => item.accountId).slice(0, limit);
    const term = exactRemote[0]
      ? (terms.find((candidate) => candidate.toLowerCase() === exactRemote[0]?.nickname.toLowerCase()) ?? null)
      : (best?.term ?? null);

    return { results: merged, term };
  }
}
