import type { VehicleCatalog, VehicleFilter } from '@otmetki/schemas';

import { Injectable } from '@nestjs/common';
import { sortBy } from 'remeda';

import { VehicleCatalogService } from '../../reference';

@Injectable()
export class VehicleListService {
  constructor(private readonly catalog: VehicleCatalogService) {}

  async list(filter: VehicleFilter): Promise<VehicleCatalog> {
    const entries = await this.catalog.filter(filter);

    return sortBy(
      entries.map((entry) => entry.summary),
      (vehicle) => vehicle.nation,
      (vehicle) => vehicle.tier,
      (vehicle) => vehicle.name
    );
  }
}
