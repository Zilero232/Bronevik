import { chunk } from 'remeda';

import type { Prisma } from '../../../../../generated';
import type { CatalogCounts, ImportCounts, InBatchesInput, PlanWriteInput, SpecHistoryCounts, WriteImportPlanInput } from './importer.types';

import { diffSpecs } from './diff';
import { WRITE } from './importer.constants';

const toJson = (value: unknown): Prisma.InputJsonValue => JSON.parse(JSON.stringify(value ?? {}));

const inBatches = async <T>({ items, size = WRITE.batchSize, run }: InBatchesInput<T>): Promise<number> => {
  for (const batch of chunk(items, size)) {
    await run(batch);
  }

  return items.length;
};

const upsertGameVersion = async ({ prisma, plan, markCurrent }: Pick<WriteImportPlanInput, 'markCurrent' | 'plan' | 'prisma'>): Promise<number> => {
  const source = plan.revision.sourceId === 'PT_RU' ? 'PT_RU' : 'RU';
  const isTest = source === 'PT_RU';

  const gameVersion = await prisma.gameVersion.upsert({
    where: { source_version: { source, version: plan.version } },
    create: {
      source,
      isTest,
      version: plan.version,
      title: plan.title,
      commitSha: plan.revision.sha,
      releasedAt: plan.revision.committedAt ? new Date(plan.revision.committedAt) : undefined
    },
    update: { title: plan.title, commitSha: plan.revision.sha }
  });

  if (markCurrent) {
    await prisma.$transaction([
      prisma.gameVersion.updateMany({ where: { source, id: { not: gameVersion.id } }, data: { isCurrent: false } }),
      prisma.gameVersion.update({ where: { id: gameVersion.id }, data: { isCurrent: true } })
    ]);
  }

  return gameVersion.id;
};

const writeEntries = async ({ prisma, plan, gameVersionId }: PlanWriteInput): Promise<number> => {
  await prisma.gameDataEntry.deleteMany({ where: { gameVersionId } });

  return inBatches({
    items: plan.entries,
    size: WRITE.entryBatchSize,
    run: (batch) =>
      prisma.gameDataEntry.createMany({
        data: batch.map((entry) => ({ gameVersionId, kind: entry.kind, key: entry.key, data: toJson(entry.data) })),
        skipDuplicates: true
      })
  });
};

const writeCatalog = async ({ prisma, plan }: Omit<PlanWriteInput, 'gameVersionId'>): Promise<CatalogCounts> => {
  const vehicles = await inBatches({
    items: plan.vehicles,
    run: (batch) =>
      prisma.$transaction(
        batch.map((row) => {
          const game = {
            nation: row.nation,
            type: row.type,
            tier: row.tier,
            tag: row.tag,
            isPremium: row.isPremium,
            isCollectible: row.isCollectible,
            isWheeled: row.isWheeled,
            priceCredit: row.priceCredit ?? null,
            priceGold: row.priceGold ?? null,
            specs: toJson(row.specs),
            crew: toJson(row.crew),
            modulesTree: toJson(row.modulesTree),
            nextTanks: toJson(row.nextTanks),
            prevTankIds: row.prevTankIds
          };

          return prisma.vehicle.upsert({
            where: { tankId: row.tankId },
            create: { tankId: row.tankId, name: row.name, shortName: row.shortName, slug: row.slug, ...game },
            update: game
          });
        })
      )
  });

  const profiles = await inBatches({
    items: plan.profiles,
    run: (batch) =>
      prisma.$transaction(
        batch.map((row) =>
          prisma.vehicleProfile.upsert({
            where: { tankId_profileId: { tankId: row.tankId, profileId: row.profileId } },
            create: { tankId: row.tankId, profileId: row.profileId, isDefault: row.isDefault, moduleIds: row.moduleIds, data: toJson(row.data) },
            update: { isDefault: row.isDefault, moduleIds: row.moduleIds, data: toJson(row.data) }
          })
        )
      )
  });

  const modules = await inBatches({
    items: plan.modules,
    run: (batch) =>
      prisma.$transaction(
        batch.map((row) => {
          const fields = {
            name: row.name,
            type: row.type,
            nation: row.nation,
            tier: row.tier,
            priceCredit: row.priceCredit ?? null,
            weight: row.weight ?? null,
            tankIds: row.tankIds,
            data: toJson(row.data)
          };

          return prisma.module.upsert({ where: { moduleId: row.moduleId }, create: { moduleId: row.moduleId, ...fields }, update: fields });
        })
      )
  });

  const provisions = await inBatches({
    items: plan.provisions,
    run: (batch) =>
      prisma.$transaction(
        batch.map((row) => {
          const fields = {
            tag: row.tag,
            type: row.type,
            image: row.image ?? null,
            priceCredit: row.priceCredit ?? null,
            priceGold: row.priceGold ?? null,
            tankIds: row.tankIds,
            data: toJson(row.data)
          };

          return prisma.provision.upsert({
            where: { provisionId: row.provisionId },
            create: { provisionId: row.provisionId, name: row.name, description: row.description, ...fields },
            update: fields
          });
        })
      )
  });

  const crewRoles = await inBatches({
    items: plan.crewRoles,
    run: (batch) =>
      prisma.$transaction(batch.map((row) => prisma.crewRole.upsert({ where: { role: row.role }, create: row, update: { skills: row.skills } })))
  });

  const crewSkills = await inBatches({
    items: plan.crewSkills,
    run: (batch) =>
      prisma.$transaction(
        batch.map((row) => {
          const fields = { type: row.type ?? null, roles: row.roles, isCommon: row.isCommon, data: toJson(row.data) };

          return prisma.crewSkill.upsert({ where: { skill: row.skill }, create: { skill: row.skill, name: row.name, ...fields }, update: fields });
        })
      )
  });

  const arenas = await inBatches({
    items: plan.arenas,
    run: (batch) =>
      prisma.$transaction(
        batch.map((row) => {
          const fields = {
            camouflageType: row.camouflageType ?? null,
            sizeMeters: row.sizeMeters,
            modes: row.modes,
            image: row.image,
            data: toJson(row.data)
          };

          return prisma.arena.upsert({
            where: { arenaId: row.arenaId },
            create: { arenaId: row.arenaId, name: row.name, slug: row.slug, ...fields },
            update: fields
          });
        })
      )
  });

  return { vehicles, profiles, modules, provisions, crewRoles, crewSkills, arenas };
};

const writeSpecHistory = async ({ prisma, plan, gameVersionId }: PlanWriteInput): Promise<SpecHistoryCounts> => {
  const previous = await prisma.vehicleSpecHistory.findMany({
    where: { gameVersionId: { not: gameVersionId } },
    orderBy: { capturedAt: 'desc' },
    distinct: ['tankId'],
    select: { tankId: true, specs: true }
  });

  const previousByTank = new Map(previous.map((row) => [row.tankId, row.specs]));
  let changedVehicles = 0;

  const rows = [...plan.summaries.entries()].map(([tankId, summary]) => {
    const before = previousByTank.get(tankId);
    const diff = before === undefined ? undefined : diffSpecs({ before, after: JSON.parse(JSON.stringify(summary)) });

    if (diff && diff.length > 0) {
      changedVehicles += 1;
    }

    return { tankId, specs: toJson(summary), diff: diff === undefined ? undefined : toJson(diff) };
  });

  const specHistory = await inBatches({
    items: rows,
    run: (batch) =>
      prisma.$transaction(
        batch.map((row) =>
          prisma.vehicleSpecHistory.upsert({
            where: { tankId_gameVersionId: { tankId: row.tankId, gameVersionId } },
            create: { tankId: row.tankId, gameVersionId, specs: row.specs, diff: row.diff },
            update: { specs: row.specs, diff: row.diff }
          })
        )
      )
  });

  return { specHistory, changedVehicles };
};

export const writeImportPlan = async ({ prisma, plan, mode, markCurrent, onProgress }: WriteImportPlanInput): Promise<ImportCounts> => {
  const gameVersionId = await upsertGameVersion({ prisma, plan, markCurrent });

  onProgress?.(`Game version ${plan.version} → id ${gameVersionId}`);

  const entries = await writeEntries({ prisma, plan, gameVersionId });

  onProgress?.(`${entries} raw game data entries`);

  if (mode === 'snapshot') {
    return {
      gameVersionId,
      entries,
      vehicles: 0,
      profiles: 0,
      modules: 0,
      provisions: 0,
      crewRoles: 0,
      crewSkills: 0,
      arenas: 0,
      specHistory: 0,
      changedVehicles: 0
    };
  }

  const catalog = await writeCatalog({ prisma, plan });

  onProgress?.(`${catalog.vehicles} vehicles, ${catalog.modules} modules, ${catalog.provisions} provisions, ${catalog.arenas} arenas`);

  const history = await writeSpecHistory({ prisma, plan, gameVersionId });

  return { gameVersionId, entries, ...catalog, ...history };
};
