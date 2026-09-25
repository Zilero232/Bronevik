import { InjectQueue } from '@nestjs/bullmq';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bullmq';
import { isNonNullish } from 'remeda';

import type { LestaClients } from '../../../../core';
import type { EncyclopediaPayload } from '../../contracts';
import type { SectionRunner, VersionCheckResult, WriteVehicleInput } from '../reference.types';

import { toJsonValue } from '../../../../common/lib';
import { LESTA_CLIENTS, PrismaService } from '../../../../core';
import { COLLECTOR_STATE_KEY } from '../../config';
import { JOB, QUEUE } from '../../contracts';
import { REFERENCE } from '../config';
import {
  achievementSchema,
  arenaSchema,
  crewRoleSchema,
  crewSkillSchema,
  keyedEntries,
  moduleSchema,
  previousTankIds,
  provisionSchema,
  slugify,
  specDiff,
  toModuleType,
  toProvisionType,
  toVehicleType,
  vehicleSlugs
} from '../lib/encyclopedia';

@Injectable()
export class EncyclopediaSyncService {
  private readonly logger = new Logger(EncyclopediaSyncService.name);

  constructor(
    private readonly prisma: PrismaService,
    @Inject(LESTA_CLIENTS) private readonly clients: LestaClients,
    @InjectQueue(QUEUE.reference) private readonly queue: Queue
  ) {}

  async checkVersion(): Promise<VersionCheckResult> {
    const info = await this.clients.priority.encyclopedia.info();
    const current = await this.prisma.gameVersion.findFirst({ where: { isCurrent: true }, select: { version: true } });
    const changed = current?.version !== info.game_version;

    if (changed) {
      await this.queue.add(JOB.reference.encyclopedia, { force: true } satisfies EncyclopediaPayload, {
        deduplication: { id: `encyclopedia:${info.game_version}` }
      });
    }

    return { version: info.game_version, changed };
  }

  async sync({ force }: EncyclopediaPayload) {
    const info = await this.clients.priority.encyclopedia.info();
    const previous = await this.prisma.gameVersion.findFirst({ where: { isCurrent: true, source: REFERENCE.gameSource } });

    if (!force && previous?.version === info.game_version) {
      return { version: info.game_version, skipped: true };
    }

    const version = await this.prisma.$transaction(async (tx) => {
      await tx.gameVersion.updateMany({ where: { isCurrent: true, NOT: { version: info.game_version } }, data: { isCurrent: false } });

      return tx.gameVersion.upsert({
        where: { source_version: { source: REFERENCE.gameSource, version: info.game_version } },
        create: { version: info.game_version, isCurrent: true },
        update: { isCurrent: true }
      });
    });

    const value = { version: info.game_version, tanksUpdatedAt: info.tanks_updated_at, syncedAt: new Date().toISOString() };

    await this.prisma.collectorState.upsert({
      where: { key: COLLECTOR_STATE_KEY.gameVersion },
      create: { key: COLLECTOR_STATE_KEY.gameVersion, value },
      update: { value }
    });

    const sections: [string, SectionRunner][] = [
      ['vehicles', () => this.syncVehicles(version.id)],
      ['modules', () => this.syncModules()],
      ['provisions', () => this.syncProvisions()],
      ['crew', () => this.syncCrew()],
      ['arenas', () => this.syncArenas()],
      ['achievements', () => this.syncAchievements()]
    ];

    const counts: Record<string, number> = {};

    for (const [name, run] of sections) {
      try {
        counts[name] = await run();
      } catch (error) {
        this.logger.error(`encyclopedia ${name} failed: ${String(error)}`);
        counts[name] = -1;
      }
    }

    return { version: info.game_version, counts };
  }

  private async syncVehicles(gameVersionId: number): Promise<number> {
    const vehicles = Object.values(await this.clients.bulk.encyclopedia.allVehicles()).filter(isNonNullish);
    const slugs = vehicleSlugs({ vehicles });
    const previous = previousTankIds(vehicles);
    const history = new Map(
      (
        await this.prisma.vehicleSpecHistory.findMany({
          where: { gameVersionId: { not: gameVersionId } },
          orderBy: { capturedAt: 'desc' },
          distinct: ['tankId']
        })
      ).map((row) => [row.tankId, row.specs])
    );

    let written = 0;

    for (const vehicle of vehicles) {
      const type = toVehicleType(vehicle.type);

      if (!type) {
        continue;
      }

      await this.writeVehicle({
        vehicle,
        type,
        slug: slugs.get(vehicle.tank_id) ?? `tank-${vehicle.tank_id}`,
        prevTankIds: previous.get(vehicle.tank_id) ?? []
      });

      await this.prisma.vehicleSpecHistory.upsert({
        where: { tankId_gameVersionId: { tankId: vehicle.tank_id, gameVersionId } },
        create: {
          tankId: vehicle.tank_id,
          gameVersionId,
          specs: toJsonValue(vehicle.default_profile),
          diff: toJsonValue(specDiff({ previous: history.get(vehicle.tank_id), next: vehicle.default_profile }))
        },
        update: { specs: toJsonValue(vehicle.default_profile) }
      });

      written += 1;
    }

    await this.prisma.vehicle.updateMany({ where: { tankId: { notIn: vehicles.map((vehicle) => vehicle.tank_id) } }, data: { isActive: false } });

    return written;
  }

  private async writeVehicle({ vehicle, type, slug, prevTankIds }: WriteVehicleInput) {
    const data = {
      name: vehicle.name,
      shortName: vehicle.short_name ?? vehicle.name,
      nation: vehicle.nation,
      type,
      tier: vehicle.tier,
      tag: vehicle.tag ?? null,
      description: vehicle.description ?? null,
      isPremium: vehicle.is_premium,
      isGift: vehicle.is_gift ?? false,
      isWheeled: vehicle.is_wheeled ?? false,
      isActive: true,
      images: toJsonValue(vehicle.images),
      priceCredit: vehicle.price_credit ?? null,
      priceGold: vehicle.price_gold ?? null,
      specs: toJsonValue(vehicle.default_profile),
      prevTankIds,
      nextTanks: toJsonValue(vehicle.next_tanks),
      modulesTree: toJsonValue(vehicle.modules_tree),
      crew: toJsonValue(vehicle.crew)
    };

    await this.prisma.vehicle.upsert({ where: { tankId: vehicle.tank_id }, create: { tankId: vehicle.tank_id, slug, ...data }, update: data });

    const profile = vehicle.default_profile;

    if (profile) {
      const profileId = profile.profile_id ?? REFERENCE.defaultProfileId;
      const moduleIds = Object.values(profile.modules ?? {}).filter((value): value is number => typeof value === 'number');
      const payload = { isDefault: true, moduleIds, data: toJsonValue(profile) };

      await this.prisma.vehicleProfile.upsert({
        where: { tankId_profileId: { tankId: vehicle.tank_id, profileId } },
        create: { tankId: vehicle.tank_id, profileId, ...payload },
        update: payload
      });
    }
  }

  private async syncModules(): Promise<number> {
    const rows = keyedEntries(await this.clients.bulk.encyclopedia.modules()).flatMap(([, value]) => {
      const parsed = moduleSchema.safeParse(value);
      const type = parsed.success ? toModuleType(parsed.data.type) : null;

      return parsed.success && type ? [{ ...parsed.data, type }] : [];
    });

    for (const row of rows) {
      const data = {
        name: row.name,
        type: row.type,
        nation: row.nation,
        tier: row.tier,
        priceCredit: row.price_credit ?? null,
        weight: row.weight ?? null,
        image: row.image ?? null,
        tankIds: row.tanks ?? [],
        data: toJsonValue(row)
      };

      await this.prisma.module.upsert({ where: { moduleId: row.module_id }, create: { moduleId: row.module_id, ...data }, update: data });
    }

    return rows.length;
  }

  private async syncProvisions(): Promise<number> {
    const rows = keyedEntries(await this.clients.bulk.encyclopedia.provisions()).flatMap(([, value]) => {
      const parsed = provisionSchema.safeParse(value);
      const type = parsed.success ? toProvisionType(parsed.data.type) : null;

      return parsed.success && type ? [{ ...parsed.data, type }] : [];
    });

    for (const row of rows) {
      const data = {
        name: row.name,
        tag: row.tag ?? null,
        type: row.type,
        description: row.description ?? null,
        image: row.image ?? null,
        priceCredit: row.price_credit ?? null,
        priceGold: row.price_gold ?? null,
        weight: row.weight ?? null,
        tankIds: row.tanks ?? [],
        data: toJsonValue(row)
      };

      await this.prisma.provision.upsert({
        where: { provisionId: row.provision_id },
        create: { provisionId: row.provision_id, ...data },
        update: data
      });
    }

    return rows.length;
  }

  private async syncCrew(): Promise<number> {
    const skills = keyedEntries(await this.clients.bulk.encyclopedia.crewskills()).flatMap(([key, value]) => {
      const parsed = crewSkillSchema.safeParse({ skill: key, ...(typeof value === 'object' ? value : {}) });

      return parsed.success ? [parsed.data] : [];
    });

    for (const skill of skills) {
      const data = {
        name: skill.name,
        type: skill.type ?? null,
        roles: skill.roles ?? [],
        isCommon: skill.is_common ?? false,
        description: skill.description ?? null,
        image: Object.values(skill.image_url ?? {}).find(isNonNullish) ?? null,
        data: toJsonValue(skill)
      };

      await this.prisma.crewSkill.upsert({ where: { skill: skill.skill }, create: { skill: skill.skill, ...data }, update: data });
    }

    const roles = keyedEntries(await this.clients.bulk.encyclopedia.crewroles()).flatMap(([role, value]) => {
      const parsed = crewRoleSchema.safeParse(value);

      return parsed.success ? [{ role, ...parsed.data }] : [];
    });

    for (const role of roles) {
      const data = { name: role.name, skills: role.skills ?? [] };

      await this.prisma.crewRole.upsert({ where: { role: role.role }, create: { role: role.role, ...data }, update: data });
    }

    return skills.length + roles.length;
  }

  private async syncArenas(): Promise<number> {
    const arenas = keyedEntries(await this.clients.bulk.encyclopedia.arenas()).flatMap(([arenaId, value]) => {
      const parsed = arenaSchema.safeParse(value);

      return parsed.success ? [{ arenaId, ...parsed.data }] : [];
    });

    for (const arena of arenas) {
      const data = {
        name: arena.name_i18n ?? arena.name ?? arena.arenaId,
        camouflageType: arena.camouflage_type ?? null,
        description: arena.description ?? null,
        image: arena.image ?? null,
        data: toJsonValue(arena)
      };

      await this.prisma.arena.upsert({
        where: { arenaId: arena.arenaId },
        create: { arenaId: arena.arenaId, slug: slugify(arena.arenaId) || arena.arenaId, ...data },
        update: data
      });
    }

    return arenas.length;
  }

  private async syncAchievements(): Promise<number> {
    const achievements = keyedEntries(await this.clients.bulk.encyclopedia.achievements()).flatMap(([, value]) => {
      const parsed = achievementSchema.safeParse(value);

      return parsed.success ? [parsed.data] : [];
    });

    for (const achievement of achievements) {
      const data = {
        section: achievement.section ?? null,
        type: achievement.type ?? null,
        title: achievement.name_i18n ?? achievement.name,
        description: achievement.description ?? null,
        condition: achievement.condition ?? null,
        image: achievement.image_big ?? achievement.image ?? null,
        options: toJsonValue(achievement.options),
        order: achievement.order ?? null
      };

      await this.prisma.achievement.upsert({ where: { name: achievement.name }, create: { name: achievement.name, ...data }, update: data });
    }

    return achievements.length;
  }
}
