import type { ArmorModelResponse } from '@bronevik/schemas';

import { bytesToBase64 } from '@bronevik/gamedata';
import { armorModulesSchema } from '@bronevik/schemas';
import { Inject, Injectable } from '@nestjs/common';

import type { ArmorStorage } from '../../gamedata';

import { AppNotFoundException } from '../../../common/exceptions';
import { ARMOR_VIEWER } from '../../../config';
import { PrismaService } from '../../../core';
import { VehicleCatalogService } from '../../reference';
import { ARMOR_STORAGE } from '../config';

@Injectable()
export class TankArmorService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly catalog: VehicleCatalogService,
    @Inject(ARMOR_STORAGE) private readonly storage: ArmorStorage
  ) {}

  async armor(tankId: number): Promise<ArmorModelResponse> {
    if (!ARMOR_VIEWER.enabled) {
      throw new AppNotFoundException('ARMOR_MODEL_NOT_FOUND', 'The armor viewer is switched off');
    }

    const [entry, row] = await Promise.all([this.catalog.find(tankId), this.prisma.vehicleArmorModel.findUnique({ where: { tankId } })]);

    if (!entry || !row) {
      throw new AppNotFoundException('ARMOR_MODEL_NOT_FOUND', `No armor model for tank ${tankId}`);
    }

    const bytes = await this.storage.get(row.storageKey).catch(() => {
      throw new AppNotFoundException('ARMOR_MODEL_NOT_FOUND', `Armor geometry ${row.storageKey} is missing from storage`);
    });

    return {
      vehicle: entry.summary,
      gameVersion: row.gameVersion,
      hash: row.hash,
      geometry: bytesToBase64(bytes),
      modules: armorModulesSchema.parse(row.modules),
      source: { repo: ARMOR_VIEWER.sourceRepo, commit: row.sourceSha }
    };
  }
}
