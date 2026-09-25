import { describe, expect, it } from 'vitest';
import { mockDeep } from 'vitest-mock-extended';

import type { PrismaService } from '../../../../core';

import { PLAYTIME } from '../../lib';
import { PlayerPlaytimeService } from '../player-playtime.service';

const cell = { weekday: 0, hour: 20, battles: 4, wins: 3, damage: 8_000 };

const createService = ({ battles, snapshots }: { battles: (typeof cell)[]; snapshots: (typeof cell)[] }) => {
  const prisma = mockDeep<PrismaService>();

  prisma.$queryRaw.mockResolvedValueOnce(battles).mockResolvedValueOnce(snapshots);

  return new PlayerPlaytimeService(prisma);
};

describe('PlayerPlaytimeService.playtime', () => {
  it('prefers the exact start times of mod battles', async () => {
    const playtime = await createService({ battles: [cell], snapshots: [] }).playtime(1n);

    expect(playtime.source).toBe('battles');
    expect(playtime.battles).toBe(cell.battles);
  });

  it('falls back to API polls when the mod reported nothing', async () => {
    const playtime = await createService({ battles: [], snapshots: [cell] }).playtime(1n);

    expect(playtime.source).toBe('snapshots');
  });

  it('answers a full empty week when there is no data at all', async () => {
    const playtime = await createService({ battles: [], snapshots: [] }).playtime(1n);

    expect(playtime.source).toBe('none');
    expect(playtime.cells).toHaveLength(PLAYTIME.weekdays * PLAYTIME.hours);
    expect(playtime.cells.every((entry) => entry.battles === 0 && entry.winRate === null)).toBe(true);
  });
});
