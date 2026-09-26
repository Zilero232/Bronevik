import { base64ToBytes } from '@bronevik/gamedata';
import { armorModelSchema } from '@bronevik/schemas';
import { describe, expect, it, vi } from 'vitest';
import { mock, mockDeep } from 'vitest-mock-extended';

import type { VehicleArmorModel } from '../../../../../generated';
import type { PrismaService } from '../../../../core';
import type { ArmorStorage } from '../../../gamedata';
import type { VehicleCatalogService } from '../../../reference';

import { AppNotFoundException } from '../../../../common/exceptions';
import { TankArmorService } from '../tank-armor.service';

const SUMMARY = {
  tankId: 7169,
  name: 'IS-7',
  shortName: 'IS-7',
  slug: 'is-7',
  nation: 'ussr',
  type: 'heavyTank',
  tier: 10,
  isPremium: false,
  isCollectible: false,
  images: { small: null, contour: null, big: null }
} as const;

const ROW: VehicleArmorModel = {
  tankId: SUMMARY.tankId,
  gameVersion: '1.45.0.5231',
  storageKey: 'armor/7169/abc.bin',
  hash: 'abc',
  bytes: 3,
  modules: { hull: { piece: 'Hull', plates: [{ name: 'armor_1', thickness: 150, flags: 0 }] }, chassis: [], turrets: [] },
  sourceSha: 'b'.repeat(40),
  updatedAt: new Date('2026-09-25T00:00:00Z')
};

const createService = ({ row, stored }: { row: VehicleArmorModel | null; stored?: Uint8Array }) => {
  const prisma = mockDeep<PrismaService>();
  const catalog = mock<VehicleCatalogService>();

  const storage: ArmorStorage = {
    put: vi.fn(),
    remove: vi.fn(),
    get: vi.fn(async () => {
      if (!stored) {
        throw new Error('ENOENT');
      }

      return stored;
    })
  };

  prisma.vehicleArmorModel.findUnique.mockResolvedValue(row);
  catalog.find.mockResolvedValue({ summary: SUMMARY } as never);

  return new TankArmorService(prisma, catalog, storage);
};

describe('TankArmorService', () => {
  it('returns the stored geometry as base64 with the plate tables and the mirror commit', async () => {
    const stored = new Uint8Array([66, 82, 65]);
    const response = await createService({ row: ROW, stored }).armor(SUMMARY.tankId);

    expect(armorModelSchema.parse(response)).toBeTruthy();
    expect([...base64ToBytes(response.geometry)]).toEqual([...stored]);
    expect(response.source.commit).toBe(ROW.sourceSha);
    expect(response.modules.hull.plates[0].thickness).toBe(150);
  });

  it('is a not-found when the tank has no armor model', async () => {
    await expect(createService({ row: null }).armor(SUMMARY.tankId)).rejects.toBeInstanceOf(AppNotFoundException);
  });

  it('is a not-found when the row exists but the stored object is gone', async () => {
    await expect(createService({ row: ROW }).armor(SUMMARY.tankId)).rejects.toBeInstanceOf(AppNotFoundException);
  });
});
