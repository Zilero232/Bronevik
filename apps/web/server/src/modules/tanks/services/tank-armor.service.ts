import type { ArmorModelResponse } from '@otmetki/schemas';

import { Inject, Injectable } from '@nestjs/common';
import { bytesToBase64 } from '@otmetki/gamedata';
import { armorModulesSchema } from '@otmetki/schemas';
import { LRUCache } from 'lru-cache';

import type { ArmorStorage } from '../../gamedata';
import type { OpenArmorInput } from '../tanks.types';

import { AppNotFoundException } from '../../../common/exceptions';
import { ARMOR_VIEWER } from '../../../config';
import { PrismaService } from '../../../core';
import { MODEL_SOURCES } from '../../gamedata';
import { VehicleCatalogService } from '../../reference';
import { UsageMeterService } from '../../usage';
import { ARMOR_STORAGE } from '../config';
import { TankDetailService } from './tank-detail.service';

@Injectable()
export class TankArmorService {
  private readonly models = new LRUCache<number, ArmorModelResponse>({
    max: ARMOR_VIEWER.memoryCache.maxEntries,
    ttl: ARMOR_VIEWER.memoryCache.ttlMs
  });

  constructor(
    private readonly prisma: PrismaService,
    private readonly catalog: VehicleCatalogService,
    private readonly details: TankDetailService,
    private readonly usage: UsageMeterService,
    @Inject(ARMOR_STORAGE) private readonly storage: ArmorStorage
  ) {}

  async open({ idOrSlug, actor }: OpenArmorInput): Promise<ArmorModelResponse> {
    const tankId = await this.details.resolve(idOrSlug);
    const model = await this.armor(tankId);

    await this.usage.consume({ meter: ARMOR_VIEWER.meter, actor, subject: String(tankId) });

    return model;
  }

  async armor(tankId: number): Promise<ArmorModelResponse> {
    const cached = this.models.get(tankId);

    if (cached) {
      return cached;
    }

    const model = await this.load(tankId);

    this.models.set(tankId, model);

    return model;
  }

  private async load(tankId: number): Promise<ArmorModelResponse> {
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
      source: { repo: ARMOR_VIEWER.sourceRepo, commit: row.sourceSha, client: MODEL_SOURCES.RU.guid }
    };
  }
}
