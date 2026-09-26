import type { CatalogCounts, PlanWriteInput } from '../importer.types';

import { inBatches, toStoredJson } from './batches';

export const writeCatalog = async ({ prisma, plan }: Omit<PlanWriteInput, 'gameVersionId'>): Promise<CatalogCounts> => {
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
            specs: toStoredJson(row.specs),
            crew: toStoredJson(row.crew),
            modulesTree: toStoredJson(row.modulesTree),
            nextTanks: toStoredJson(row.nextTanks),
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
            create: {
              tankId: row.tankId,
              profileId: row.profileId,
              isDefault: row.isDefault,
              moduleIds: row.moduleIds,
              data: toStoredJson(row.data)
            },
            update: { isDefault: row.isDefault, moduleIds: row.moduleIds, data: toStoredJson(row.data) }
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
            data: toStoredJson(row.data)
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
            data: toStoredJson(row.data)
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
          const fields = { type: row.type ?? null, roles: row.roles, isCommon: row.isCommon, data: toStoredJson(row.data) };

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
            data: toStoredJson(row.data)
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
