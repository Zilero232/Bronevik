import { InjectQueue } from '@nestjs/bullmq';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bullmq';

import type { LestaClients } from '../../../../core';
import type { EncyclopediaPayload } from '../../contracts';
import type { SectionRunner, VersionCheckResult } from '../reference.types';

import { errorMessage } from '../../../../common/lib';
import { LESTA_CLIENTS, PrismaService } from '../../../../core';
import { COLLECTOR_STATE_KEY } from '../../config';
import { JOB, QUEUE } from '../../contracts';
import { REFERENCE } from '../config';
import { CatalogSyncService } from './catalog-sync.service';
import { EquipmentSyncService } from './equipment-sync.service';
import { VehicleSyncService } from './vehicle-sync.service';

@Injectable()
export class EncyclopediaSyncService {
  private readonly logger = new Logger(EncyclopediaSyncService.name);

  constructor(
    private readonly prisma: PrismaService,
    @Inject(LESTA_CLIENTS) private readonly clients: LestaClients,
    @InjectQueue(QUEUE.reference) private readonly queue: Queue,
    private readonly vehicles: VehicleSyncService,
    private readonly equipment: EquipmentSyncService,
    private readonly catalog: CatalogSyncService
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
      ['vehicles', () => this.vehicles.sync(version.id)],
      ['modules', () => this.equipment.modules()],
      ['provisions', () => this.equipment.provisions()],
      ['crew', () => this.equipment.crew()],
      ['arenas', () => this.catalog.arenas()],
      ['achievements', () => this.catalog.achievements()]
    ];

    const counts: Record<string, number> = {};

    for (const [name, run] of sections) {
      try {
        counts[name] = await run();
      } catch (error) {
        this.logger.error(`encyclopedia ${name} failed: ${errorMessage(error)}`);
        counts[name] = -1;
      }
    }

    return { version: info.game_version, counts };
  }
}
