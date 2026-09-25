import type { TankComparison } from '@bronevik/schemas';

import { Injectable } from '@nestjs/common';

import type { CompareTanksInput } from '../compare.types';

import { AppNotFoundException } from '../../../common/exceptions';
import { PrismaService } from '../../../core';
import { VehicleCatalogService } from '../../reference';
import { COMPARE_PROFILE } from '../config';
import { bestBySpec, numericSpecs } from '../lib';

@Injectable()
export class TankCompareService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly catalog: VehicleCatalogService
  ) {}

  async compare({ tankIds, profiles }: CompareTanksInput): Promise<TankComparison> {
    const stored = await this.prisma.vehicleProfile.findMany({ where: { tankId: { in: tankIds } } });

    const vehicles = await Promise.all(
      tankIds.map(async (tankId, index) => {
        const entry = await this.catalog.find(tankId);

        if (!entry) {
          throw new AppNotFoundException('TANK_NOT_FOUND', `No tank ${tankId}`);
        }

        const wanted = profiles?.[index];
        const own = stored.filter((profile) => profile.tankId === tankId);
        const profile =
          own.find((candidate) => candidate.profileId === (wanted ?? COMPARE_PROFILE.preferred)) ??
          own.find((candidate) => candidate.isDefault) ??
          own[0];

        return {
          vehicle: entry.summary,
          profileId: profile?.profileId ?? 'default',
          specs: numericSpecs(profile?.data)
        };
      })
    );

    return {
      vehicles,
      best: bestBySpec(vehicles.map((vehicle) => ({ tankId: vehicle.vehicle.tankId, specs: vehicle.specs })))
    };
  }
}
