import { describe, expect, it } from 'vitest';

import { upsertGameVersion } from '../game-version';
import { createPrisma, plan } from './writer.fixtures';

describe('upsertGameVersion', () => {
  it('files a live-server revision as a release version', async () => {
    const prisma = createPrisma();

    await upsertGameVersion({ prisma, plan: plan(), markCurrent: false });

    expect(prisma.gameVersion.upsert.mock.calls[0]?.[0].create).toMatchObject({ source: 'RU', isTest: false, version: '2.1.0', commitSha: 'abc123' });
  });

  it('files a public-test revision as a test version', async () => {
    const prisma = createPrisma();
    const testPlan = plan();

    await upsertGameVersion({ prisma, plan: { ...testPlan, revision: { ...testPlan.revision, sourceId: 'PT_RU' } }, markCurrent: false });

    expect(prisma.gameVersion.upsert.mock.calls[0]?.[0].create).toMatchObject({ source: 'PT_RU', isTest: true });
  });

  it('leaves the release date unset when the commit time is unknown', async () => {
    const prisma = createPrisma();

    await upsertGameVersion({ prisma, plan: plan(), markCurrent: false });

    expect(prisma.gameVersion.upsert.mock.calls[0]?.[0].create.releasedAt).toBeUndefined();
  });

  it('dates the release by the commit time when known', async () => {
    const prisma = createPrisma();
    const committedAt = '2026-09-20T10:00:00Z';
    const dated = plan();

    await upsertGameVersion({ prisma, plan: { ...dated, revision: { ...dated.revision, committedAt } }, markCurrent: false });

    expect(prisma.gameVersion.upsert.mock.calls[0]?.[0].create.releasedAt).toEqual(new Date(committedAt));
  });

  it('does not touch the current flag unless asked', async () => {
    const prisma = createPrisma();

    expect(await upsertGameVersion({ prisma, plan: plan(), markCurrent: false })).toBe(7);
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });

  it('makes the version the only current one of its source when asked', async () => {
    const prisma = createPrisma(7);

    await upsertGameVersion({ prisma, plan: plan(), markCurrent: true });

    expect(prisma.gameVersion.updateMany.mock.calls[0]?.[0]).toEqual({ where: { source: 'RU', id: { not: 7 } }, data: { isCurrent: false } });
    expect(prisma.gameVersion.update.mock.calls[0]?.[0]).toEqual({ where: { id: 7 }, data: { isCurrent: true } });
  });
});
