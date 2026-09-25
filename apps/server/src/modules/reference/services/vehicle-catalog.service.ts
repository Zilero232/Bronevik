import type { VehicleSummary } from '@bronevik/schemas';

import { Injectable } from '@nestjs/common';

import type { CatalogEntry, VehicleFilter } from '../reference.types';

import { PrismaService } from '../../../core';
import { CATALOG } from '../config';
import { matchesFilter, toCatalogEntry, unknownVehicle } from '../lib';

@Injectable()
export class VehicleCatalogService {
  private entries: Map<number, CatalogEntry> = new Map();
  private loadedAt = 0;
  private pending: Promise<Map<number, CatalogEntry>> | null = null;

  constructor(private readonly prisma: PrismaService) {}

  async all(): Promise<Map<number, CatalogEntry>> {
    if (Date.now() - this.loadedAt < CATALOG.ttlMs && this.entries.size > 0) {
      return this.entries;
    }

    this.pending ??= this.load().finally(() => {
      this.pending = null;
    });

    return this.pending;
  }

  async summary(tankId: number): Promise<VehicleSummary> {
    const entries = await this.all();

    return entries.get(tankId)?.summary ?? unknownVehicle(tankId);
  }

  async find(tankId: number): Promise<CatalogEntry | null> {
    const entries = await this.all();

    return entries.get(tankId) ?? null;
  }

  async bySlug(slug: string): Promise<CatalogEntry | null> {
    const entries = await this.all();

    return [...entries.values()].find((entry) => entry.summary.slug === slug) ?? null;
  }

  async tiers(): Promise<Map<number, number>> {
    const entries = await this.all();

    return new Map([...entries.values()].map((entry) => [entry.summary.tankId, entry.summary.tier]));
  }

  async filter(filter: VehicleFilter): Promise<CatalogEntry[]> {
    const entries = await this.all();

    return [...entries.values()].filter((entry) => matchesFilter({ entry, filter }));
  }

  private async load(): Promise<Map<number, CatalogEntry>> {
    const rows = await this.prisma.vehicle.findMany({ where: { isActive: true } });

    this.entries = new Map(rows.map((row) => [row.tankId, toCatalogEntry(row)]));
    this.loadedAt = Date.now();

    return this.entries;
  }
}
