import type { VehicleCatalog, VehicleFilter } from '@otmetki/schemas';

import { Injectable } from '@nestjs/common';
import { sortBy } from 'remeda';

import { VehicleCatalogService } from '../../reference';
import { TankTraitsService } from './tank-traits.service';

@Injectable()
export class VehicleListService {
  constructor(
    private readonly catalog: VehicleCatalogService,
    private readonly traits: TankTraitsService
  ) {}

  async list(filter: VehicleFilter): Promise<VehicleCatalog> {
    const [entries, traits] = await Promise.all([this.catalog.filter(filter), this.traits.all()]);

    return sortBy(
      entries.map((entry) => ({ ...entry.summary, role: traits.get(entry.summary.tankId)?.traits.role ?? null })),
      (vehicle) => vehicle.nation,
      (vehicle) => vehicle.tier,
      (vehicle) => vehicle.name
    );
  }
}
