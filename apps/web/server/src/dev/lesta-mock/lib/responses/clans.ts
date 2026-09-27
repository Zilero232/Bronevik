import type { ClanExistsInput, ClanInfoInput, ClansByIdsInput, ListItemInput, MockRoute, NameAtInput, ProvincesCountInput } from './responses.types';

import { clanElo, skirmishStats } from '../clan-activity';
import { selectFields } from '../fields';
import { clanMembersAt, stintAt } from '../world';
import { playerAt } from './account';
import { fail, idList, intParam, ok } from './envelope';
import {
  CLAN_ROLE_TITLES,
  GLOBALMAP_FRONTS,
  GLOBALMAP_PRIME_TIMES,
  RESPONSES,
  STRONGHOLD_BUILDINGS,
  STRONGHOLD_DIRECTIONS
} from './responses.constants';

const ROLE_TITLES: ReadonlyMap<string, string> = new Map(Object.entries(CLAN_ROLE_TITLES));

const roleTitle = (role: string): string => ROLE_TITLES.get(role) ?? role;

const clanExists = ({ clan, at }: ClanExistsInput): boolean => clan.createdAt <= at;

const nameAt = ({ clan, at }: NameAtInput) =>
  clan.renamedAt !== null && at < clan.renamedAt
    ? { name: clan.oldName ?? clan.name, tag: clan.oldTag ?? clan.tag }
    : { name: clan.name, tag: clan.tag };

const listItem = ({ clan, at }: ListItemInput) => ({
  clan_id: clan.clanId,
  ...nameAt({ clan, at }),
  color: clan.color,
  created_at: clan.createdAt,
  members_count: clanMembersAt({ clan, at }).length,
  emblems: null
});

const clanInfo = ({ context, clan }: ClanInfoInput) => {
  const members = clanMembersAt({ clan, at: context.now });
  const leader = members.find(({ stint }) => stint.role === 'commander') ?? members[0];
  const renamed = clan.renamedAt !== null && context.now >= clan.renamedAt;

  return {
    clan_id: clan.clanId,
    ...nameAt({ clan, at: context.now }),
    color: clan.color,
    motto: clan.motto,
    description: clan.description,
    description_html: `<p>${clan.description.replaceAll('\n', '<br/>')}</p>`,
    created_at: clan.createdAt,
    updated_at: Math.max(clan.createdAt, ...members.map(({ stint }) => (stint.joinedAt <= context.now ? stint.joinedAt : 0))),
    creator_id: leader?.player.accountId ?? null,
    creator_name: leader?.player.nickname ?? null,
    leader_id: leader?.player.accountId ?? null,
    leader_name: leader?.player.nickname ?? null,
    members_count: members.length,
    is_clan_disbanded: members.length === 0,
    old_name: renamed ? clan.oldName : null,
    old_tag: renamed ? clan.oldTag : null,
    renamed_at: renamed ? clan.renamedAt : null,
    accepts_join_requests: clan.acceptsJoinRequests,
    game: 'wot',
    emblems: null,
    members_ids: members.map(({ player }) => player.accountId),
    members: members.map(({ player, stint }) => ({
      account_id: player.accountId,
      account_name: player.nickname,
      joined_at: stint.joinedAt,
      role: stint.role,
      role_i18n: roleTitle(stint.role)
    })),
    private: null
  };
};

const clansByIds = ({ context, render }: ClansByIdsInput) => {
  const parsed = idList({ params: context.params, field: 'clan_id' });

  if ('error' in parsed) {
    return parsed.error;
  }

  const data = Object.fromEntries(
    parsed.ids.map((clanId) => {
      const clan = context.world.clanById.get(clanId);

      return [String(clanId), clan && clanExists({ clan, at: context.now }) ? selectFields({ value: render(clan), fields: context.fields }) : null];
    })
  );

  return ok({ data, meta: { count: parsed.ids.length } });
};

export const clansList: MockRoute = (context) => {
  const search = context.params.search?.trim().toLowerCase() ?? '';
  const limit = Math.min(RESPONSES.maxListLimit, Math.max(1, intParam({ params: context.params, key: 'limit', fallback: RESPONSES.maxListLimit })));
  const page = Math.max(1, intParam({ params: context.params, key: 'page_no', fallback: 1 }));

  if (search.length > 0 && search.length < RESPONSES.minClanSearchLength) {
    return fail({ code: 407, message: 'NOT_ENOUGH_SEARCH_LENGTH', field: 'search', value: search });
  }

  const matching = context.world.clans
    .filter((clan) => clanExists({ clan, at: context.now }))
    .map((clan) => listItem({ clan, at: context.now }))
    .filter((item) => item.members_count > 0)
    .filter((item) => search.length === 0 || item.tag.toLowerCase().startsWith(search) || item.name.toLowerCase().includes(search))
    .sort((left, right) => right.members_count - left.members_count || left.clan_id - right.clan_id);

  const data = matching.slice((page - 1) * limit, page * limit).map((item) => selectFields({ value: item, fields: context.fields }));

  return ok({ data, meta: { count: data.length, total: matching.length, page_total: Math.ceil(matching.length / limit), limit, page } });
};

export const clansInfo: MockRoute = (context) => clansByIds({ context, render: (clan) => clanInfo({ context, clan }) });

export const clansAccountInfo: MockRoute = (context) => {
  const parsed = idList({ params: context.params, field: 'account_id' });

  if ('error' in parsed) {
    return parsed.error;
  }

  const data = Object.fromEntries(
    parsed.ids.map((accountId) => {
      const player = playerAt({ context, accountId });
      const stint = player ? stintAt({ player, at: context.now }) : null;
      const clan = stint ? context.world.clanById.get(stint.clanId) : undefined;

      if (!player || !stint || !clan) {
        return [String(accountId), null];
      }

      return [
        String(accountId),
        selectFields({
          value: {
            account_id: player.accountId,
            account_name: player.nickname,
            joined_at: stint.joinedAt,
            role: stint.role,
            role_i18n: roleTitle(stint.role),
            clan_id: clan.clanId,
            clan: listItem({ clan, at: context.now })
          },
          fields: context.fields
        })
      ];
    })
  );

  return ok({ data, meta: { count: parsed.ids.length } });
};

export const clansMemberHistory: MockRoute = (context) => {
  const parsed = idList({ params: context.params, field: 'account_id' });

  if ('error' in parsed) {
    return parsed.error;
  }

  const data = Object.fromEntries(
    parsed.ids.map((accountId) => {
      const player = playerAt({ context, accountId });

      if (!player) {
        return [String(accountId), null];
      }

      const past = player.stints
        .filter((stint) => stint.leftAt !== null && stint.leftAt <= context.now)
        .map((stint) =>
          selectFields({
            value: { clan_id: stint.clanId, joined_at: stint.joinedAt, left_at: stint.leftAt, role: stint.role },
            fields: context.fields
          })
        );

      return [String(accountId), past];
    })
  );

  return ok({ data, meta: { count: parsed.ids.length } });
};

export const clansGlossary: MockRoute = () =>
  ok({ data: { clans_roles: CLAN_ROLE_TITLES, settings: { max_members_count: 100 }, languages: { ru: 'Русский', en: 'English' } } });

const provincesCount = ({ context, clan }: ProvincesCountInput): number =>
  clanElo({ seed: context.world.seed, clan, at: context.now }) && clan.tier === 'top' ? 1 + (clan.index % 4) : 0;

export const globalmapClanInfo: MockRoute = (context) =>
  clansByIds({
    context,
    render: (clan) => {
      const elo = clanElo({ seed: context.world.seed, clan, at: context.now });
      const skirmish = skirmishStats({ seed: context.world.seed, clan, at: context.now });

      return {
        clan_id: clan.clanId,
        ...nameAt({ clan, at: context.now }),
        ratings: {
          elo_6: elo?.[6] ?? null,
          elo_8: elo?.[8] ?? null,
          elo_10: elo?.[10] ?? null,
          updated_at: elo ? context.now - (context.now % 86_400) : null
        },
        statistics: {
          battles: elo ? Math.round((skirmish.total_10 ?? 0) * 0.3) : 0,
          wins: elo ? Math.round((skirmish.win_10 ?? 0) * 0.3) : 0,
          provinces_count: provincesCount({ context, clan }),
          captures: elo ? Math.round((skirmish.win_10 ?? 0) * 0.05) : 0
        }
      };
    }
  });

export const globalmapClanProvinces: MockRoute = (context) =>
  clansByIds({
    context,
    render: (clan) => {
      const arenas = context.world.catalog.arenas.filter((arena) => arena.modes.includes('ctf'));
      const count = provincesCount({ context, clan });

      return count === 0
        ? null
        : Array.from({ length: count }, (_, index) => {
            const arena = arenas[(clan.index + index) % Math.max(1, arenas.length)];
            const front = GLOBALMAP_FRONTS[index % GLOBALMAP_FRONTS.length];

            return {
              province_id: `${front.id}_${clan.clanId}_${index + 1}`,
              province_name: `${arena?.name ?? front.name} ${index + 1}`,
              front_id: front.id,
              front_name: front.name,
              arena_id: arena?.arenaId ?? null,
              arena_name: arena?.name ?? null,
              prime_time: GLOBALMAP_PRIME_TIMES[(clan.index + index) % GLOBALMAP_PRIME_TIMES.length],
              daily_revenue: 150 + ((clan.clanId + index * 37) % 8) * 50,
              revenue_level: index % 4,
              turns_owned: 1 + ((clan.clanId + index) % 30)
            };
          });
    }
  });

export const strongholdClanInfo: MockRoute = (context) =>
  clansByIds({
    context,
    render: (clan) => {
      const arenas = context.world.catalog.arenas.filter((arena) => arena.modes.includes('ctf'));
      const commandCenter = arenas[clan.index % Math.max(1, arenas.length)];
      const buildings = STRONGHOLD_BUILDINGS.slice(0, Math.min(STRONGHOLD_BUILDINGS.length, 2 + Math.floor(clan.strongholdLevel / 2)));

      return {
        clan_id: clan.clanId,
        clan_tag: nameAt({ clan, at: context.now }).tag,
        clan_name: nameAt({ clan, at: context.now }).name,
        level: clan.strongholdLevel,
        command_center_arena_id: commandCenter?.arenaId ?? null,
        total_resource_amount: clan.strongholdLevel * 18_000 + (clan.clanId % 9000),
        building_slots: 2 + clan.strongholdLevel,
        buildings: Object.fromEntries(
          buildings.map((building, index) => [
            String(index + 1),
            {
              building_type: building.type,
              building_title: building.title,
              level: Math.max(1, clan.strongholdLevel - (index % 3)),
              position: index + 1,
              direction_name: STRONGHOLD_DIRECTIONS[index % STRONGHOLD_DIRECTIONS.length],
              arena_id: arenas[(clan.index + index + 1) % Math.max(1, arenas.length)]?.arenaId ?? null
            }
          ])
        ),
        skirmish_statistics: skirmishStats({ seed: context.world.seed, clan, at: context.now })
      };
    }
  });

export const strongholdClanReserves: MockRoute = (context) =>
  context.tokenAccountId === null
    ? fail({ code: 402, message: 'ACCESS_TOKEN_NOT_SPECIFIED', field: 'access_token' })
    : ok({ data: [], meta: { count: 0 } });
