import type { MockCatalog, MockModule, MockVehicle } from '../../lesta-mock.types';
import type { MockContext, MockRoute } from './responses.types';

import { vehicleImages } from '../../../../lib/lesta';
import { ACHIEVEMENT_IMAGES, ACHIEVEMENT_SECTIONS, MOCK_ACHIEVEMENTS } from '../../config';
import { selectFields } from '../fields';
import { fail, idList, intParam, listOf, ok } from './envelope';
import { ENCYCLOPEDIA_LABELS, PROVISION_TYPE_TO_API, RESPONSES } from './responses.constants';

const PROVISION_TYPES: ReadonlyMap<string, string> = new Map(Object.entries(PROVISION_TYPE_TO_API));

const CREW_ROLES: ReadonlyMap<string, string> = new Map(Object.entries(ENCYCLOPEDIA_LABELS.crewRoles));

const moduleIndexes = new WeakMap<MockCatalog, ReadonlyMap<number, MockModule>>();

const moduleIndex = (catalog: MockCatalog): ReadonlyMap<number, MockModule> => {
  const cached = moduleIndexes.get(catalog);

  if (cached) {
    return cached;
  }

  const created = new Map(catalog.modules.map((module) => [module.moduleId, module]));

  moduleIndexes.set(catalog, created);

  return created;
};

const achievementImage = (name: string, big = false): string => `${ACHIEVEMENT_IMAGES.base}/${big ? `${ACHIEVEMENT_IMAGES.big}/` : ''}${name}.png`;

const byType = (context: MockContext, vehicle: MockVehicle, type: string): number[] =>
  vehicle.moduleIds.filter((moduleId) => moduleIndex(context.world.catalog).get(moduleId)?.type === type);

const vehicleEntry = (context: MockContext, vehicle: MockVehicle) => ({
  tank_id: vehicle.tankId,
  name: vehicle.name,
  short_name: vehicle.shortName,
  tier: vehicle.tier,
  type: vehicle.type,
  nation: vehicle.nation,
  tag: vehicle.tag,
  is_premium: vehicle.isPremium,
  is_gift: vehicle.isGift,
  is_premium_igr: false,
  is_wheeled: vehicle.isWheeled,
  description: vehicle.description,
  price_credit: vehicle.priceCredit,
  price_gold: vehicle.priceGold,
  images: vehicle.tag ? vehicleImages({ nation: vehicle.nation, tag: vehicle.tag }) : null,
  default_profile: { is_default: true, hp: vehicle.hp, max_ammo: vehicle.maxAmmo },
  crew: vehicle.crew.map((member) => ({
    member_id: member.role,
    roles: Object.fromEntries([member.role, ...member.extraRoles].map((role) => [role, CREW_ROLES.get(role) ?? role]))
  })),
  modules_tree: Object.fromEntries(
    vehicle.moduleIds.flatMap((moduleId) => {
      const module = moduleIndex(context.world.catalog).get(moduleId);

      return module ? [[String(moduleId), { module_id: moduleId, name: module.name, type: module.type, price_credit: module.priceCredit }]] : [];
    })
  ),
  guns: byType(context, vehicle, 'vehicleGun'),
  turrets: byType(context, vehicle, 'vehicleTurret'),
  engines: byType(context, vehicle, 'vehicleEngine'),
  radios: byType(context, vehicle, 'vehicleRadio'),
  suspensions: byType(context, vehicle, 'vehicleChassis'),
  next_tanks: Object.fromEntries(
    context.world.catalog.vehicles
      .filter((next) => next.prevTankIds.includes(vehicle.tankId))
      .map((next) => [String(next.tankId), next.priceCredit ?? 0])
  ),
  prices_xp: null
});

export const encyclopediaInfo: MockRoute = (context) =>
  ok(
    selectFields(
      {
        game_version: context.world.catalog.gameVersion,
        tanks_updated_at: context.world.catalog.tanksUpdatedAt,
        languages: ENCYCLOPEDIA_LABELS.languages,
        vehicle_types: ENCYCLOPEDIA_LABELS.vehicleTypes,
        vehicle_nations: ENCYCLOPEDIA_LABELS.nations,
        vehicle_crew_roles: ENCYCLOPEDIA_LABELS.crewRoles,
        achievement_sections: Object.fromEntries(Object.entries(ACHIEVEMENT_SECTIONS).map(([key, section]) => [key, section]))
      },
      context.fields
    )
  );

export const encyclopediaVehicles: MockRoute = (context) => {
  const parsed = idList({ params: context.params, field: 'tank_id', required: false });

  if ('error' in parsed) {
    return parsed.error;
  }

  const nations = new Set(listOf(context.params, 'nation'));
  const types = new Set(listOf(context.params, 'type'));
  const tiers = new Set(listOf(context.params, 'tier').map(Number));
  const ids = new Set(parsed.ids);
  const limit = Math.min(RESPONSES.maxListLimit, Math.max(1, intParam(context.params, 'limit', RESPONSES.maxListLimit)));
  const page = Math.max(1, intParam(context.params, 'page_no', 1));
  const matching = context.world.catalog.vehicles.filter(
    (vehicle) =>
      (ids.size === 0 || ids.has(vehicle.tankId)) &&
      (nations.size === 0 || nations.has(vehicle.nation)) &&
      (types.size === 0 || types.has(vehicle.type)) &&
      (tiers.size === 0 || tiers.has(vehicle.tier))
  );

  const pageTotal = Math.max(1, Math.ceil(matching.length / limit));

  if (ids.size === 0 && page > pageTotal) {
    return fail({ code: 407, message: 'INVALID_PAGE_NO', field: 'page_no', value: String(page) });
  }

  const slice = ids.size > 0 ? matching : matching.slice((page - 1) * limit, page * limit);
  const data = Object.fromEntries(slice.map((vehicle) => [String(vehicle.tankId), selectFields(vehicleEntry(context, vehicle), context.fields)]));

  return ok(data, { count: slice.length, page_total: ids.size > 0 ? 1 : pageTotal, total: matching.length, limit, page });
};

export const encyclopediaModules: MockRoute = (context) => {
  const parsed = idList({ params: context.params, field: 'module_id', required: false });

  if ('error' in parsed) {
    return parsed.error;
  }

  const ids = new Set(parsed.ids);
  const data = Object.fromEntries(
    context.world.catalog.modules
      .filter((module) => ids.size === 0 || ids.has(module.moduleId))
      .map((module) => [
        String(module.moduleId),
        selectFields(
          {
            module_id: module.moduleId,
            name: module.name,
            type: module.type,
            nation: module.nation,
            tier: module.tier,
            price_credit: module.priceCredit,
            weight: module.weight,
            image: null,
            tanks: module.tankIds
          },
          context.fields
        )
      ])
  );

  return ok(data, { count: Object.keys(data).length });
};

export const encyclopediaProvisions: MockRoute = (context) => {
  const parsed = idList({ params: context.params, field: 'provision_id', required: false });

  if ('error' in parsed) {
    return parsed.error;
  }

  const ids = new Set(parsed.ids);
  const data = Object.fromEntries(
    context.world.catalog.provisions
      .filter((provision) => ids.size === 0 || ids.has(provision.provisionId))
      .map((provision) => [
        String(provision.provisionId),
        selectFields(
          {
            provision_id: provision.provisionId,
            name: provision.name,
            tag: provision.tag,
            type: PROVISION_TYPES.get(provision.type) ?? provision.type,
            description: provision.description,
            image: null,
            price_credit: provision.priceCredit,
            price_gold: provision.priceGold,
            weight: provision.weight,
            tanks: provision.tankIds
          },
          context.fields
        )
      ])
  );

  return ok(data, { count: Object.keys(data).length });
};

export const encyclopediaAchievements: MockRoute = (context) => {
  const data = Object.fromEntries(
    MOCK_ACHIEVEMENTS.map((achievement, order) => [
      achievement.name,
      selectFields(
        {
          name: achievement.name,
          name_i18n: achievement.title,
          section: achievement.section,
          section_order: ACHIEVEMENT_SECTIONS[achievement.section].order,
          type: achievement.type,
          description: achievement.description,
          condition: achievement.description,
          image: achievementImage(achievement.name),
          image_big: achievementImage(achievement.name, true),
          order,
          outdated: false,
          options:
            achievement.type === 'class'
              ? [1, 2, 3, 4].map((stage) => ({
                  name_i18n: `${achievement.title} ${['I', 'II', 'III', 'IV'][stage - 1] ?? ''} степени`,
                  image: achievementImage(`${achievement.name}${stage}`),
                  image_big: achievementImage(`${achievement.name}${stage}`, true)
                }))
              : null
        },
        context.fields
      )
    ])
  );

  return ok(data, { count: MOCK_ACHIEVEMENTS.length });
};

export const encyclopediaArenas: MockRoute = (context) =>
  ok(
    Object.fromEntries(
      context.world.catalog.arenas.map((arena) => [
        arena.arenaId,
        selectFields(
          { arena_id: arena.arenaId, name_i18n: arena.name, camouflage_type: arena.camouflageType, description: arena.description },
          context.fields
        )
      ])
    )
  );

export const encyclopediaCrewSkills: MockRoute = (context) =>
  ok(
    Object.fromEntries(
      context.world.catalog.crewSkills.map((skill) => [
        skill.skill,
        selectFields(
          {
            name: skill.name,
            type: skill.type,
            roles: skill.roles,
            is_common: skill.isCommon,
            description: skill.description,
            image_url: { small_icon: null, big_icon: null }
          },
          context.fields
        )
      ])
    )
  );

export const encyclopediaCrewRoles: MockRoute = (context) =>
  ok(
    Object.fromEntries(
      context.world.catalog.crewRoles.map((role) => [role.role, selectFields({ name: role.name, skills: role.skills }, context.fields)])
    )
  );
