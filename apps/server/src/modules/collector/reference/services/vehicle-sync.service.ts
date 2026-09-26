import { Inject, Injectable } from '@nestjs/common';
import { isNonNullish } from 'remeda';

import type { LestaClients } from '../../../../core';
import type { WriteVehicleInput } from '../reference.types';

import { toJsonValue } from '../../../../common/lib';
import { LESTA_CLIENTS, PrismaService } from '../../../../core';
import { vehicleImages } from '../../../../lib/lesta';
import { REFERENCE } from '../config';
import { previousTankIds, specDiff, toVehicleType, vehicleSlugs } from '../lib/encyclopedia';

@Injectable()
export class VehicleSyncService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(LESTA_CLIENTS) private readonly clients: LestaClients
  ) {}

  async sync(gameVersionId: number): Promise<number> {
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
      priceCredit: vehicle.price_credit ?? null,
      priceGold: vehicle.price_gold ?? null,
      specs: toJsonValue(vehicle.default_profile),
      prevTankIds,
      nextTanks: toJsonValue(vehicle.next_tanks),
      modulesTree: toJsonValue(vehicle.modules_tree),
      crew: toJsonValue(vehicle.crew)
    };

    const derived = vehicle.tag ? vehicleImages({ nation: vehicle.nation, tag: vehicle.tag }) : null;
    const images = vehicle.images ?? derived;

    await this.prisma.vehicle.upsert({
      where: { tankId: vehicle.tank_id },
      create: { tankId: vehicle.tank_id, slug, ...data, images: toJsonValue(images) },
      update: images ? { ...data, images: toJsonValue(images) } : data
    });

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
}
