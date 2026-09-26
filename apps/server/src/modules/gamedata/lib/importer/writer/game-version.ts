import type { WriteImportPlanInput } from '../importer.types';

export const upsertGameVersion = async ({
  prisma,
  plan,
  markCurrent
}: Pick<WriteImportPlanInput, 'markCurrent' | 'plan' | 'prisma'>): Promise<number> => {
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
