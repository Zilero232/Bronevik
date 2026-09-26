import { describe, expect, it } from 'vitest';
import { mock } from 'vitest-mock-extended';

import type { Vehicle } from '../../../../../../../generated';
import type { ProvisionRow } from '../../importer.types';

import { writeCatalog } from '../catalog';
import { createPrisma, plan, VEHICLE_IMAGES, vehicleRow } from './writer.fixtures';

describe('writeCatalog', () => {
  it('writes nothing for an empty plan beyond the provision image cleanup', async () => {
    const prisma = createPrisma();

    expect(await writeCatalog({ prisma, plan: plan() })).toEqual({
      vehicles: 0,
      profiles: 0,
      modules: 0,
      provisions: 0,
      crewRoles: 0,
      crewSkills: 0,
      arenas: 0
    });

    expect(prisma.$transaction).not.toHaveBeenCalled();
    expect(prisma.provision.updateMany).toHaveBeenCalledOnce();
  });

  it('keeps the stored images of a vehicle that already has some', async () => {
    const prisma = createPrisma();

    prisma.vehicle.findMany.mockResolvedValue([mock<Vehicle>({ tankId: 1 })]);

    await writeCatalog({ prisma, plan: plan({ vehicles: [vehicleRow(1), vehicleRow(2)] }) });

    const [known, fresh] = prisma.vehicle.upsert.mock.calls.map(([args]) => args.update);

    expect(known).not.toHaveProperty('images');
    expect(fresh).toHaveProperty('images', VEHICLE_IMAGES);
  });

  it('never overwrites a vehicle name or slug on update', async () => {
    const prisma = createPrisma();

    await writeCatalog({ prisma, plan: plan({ vehicles: [vehicleRow(1)] }) });

    const [upsert] = prisma.vehicle.upsert.mock.calls[0] ?? [];

    expect(upsert?.create).toMatchObject({ name: 'Tank 1', slug: 'tank-1' });
    expect(upsert?.update).not.toHaveProperty('name');
    expect(upsert?.update).not.toHaveProperty('slug');
  });

  it('stores missing prices as null rather than leaving the old value', async () => {
    const prisma = createPrisma();

    await writeCatalog({ prisma, plan: plan({ vehicles: [vehicleRow(1, { priceCredit: undefined, priceGold: 0 })] }) });

    expect(prisma.vehicle.upsert.mock.calls[0]?.[0].update).toMatchObject({ priceCredit: null, priceGold: 0 });
  });

  it('keeps an admin-edited provision name and description', async () => {
    const prisma = createPrisma();
    const provision: ProvisionRow = {
      provisionId: 1,
      name: 'Rammer',
      tag: 'rammer',
      type: 'optionalDevice',
      description: 'Faster reload',
      tankIds: [],
      data: {}
    };

    await writeCatalog({ prisma, plan: plan({ provisions: [provision] }) });

    const [upsert] = prisma.provision.upsert.mock.calls[0] ?? [];

    expect(upsert?.create).toMatchObject({ name: 'Rammer', description: 'Faster reload' });
    expect(upsert?.update).not.toHaveProperty('name');
    expect(upsert?.update).not.toHaveProperty('description');
  });

  it('drops relative provision images that cannot be served', async () => {
    const prisma = createPrisma();

    await writeCatalog({ prisma, plan: plan() });

    expect(prisma.provision.updateMany.mock.calls[0]?.[0]).toMatchObject({
      where: { NOT: { image: { startsWith: 'http' } } },
      data: { image: null }
    });
  });
});
