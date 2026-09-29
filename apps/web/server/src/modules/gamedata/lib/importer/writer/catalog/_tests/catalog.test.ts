import { describe, expect, it } from 'vitest';
import { mock } from 'vitest-mock-extended';

import type { Arena, Provision, Vehicle } from '../../../../../../../../generated';
import type { ArenaRow, ProvisionRow } from '../../../importer.types';

import { createPrisma, plan, VEHICLE_IMAGES, vehicleRow } from '../../_tests/writer.fixtures';
import { writeCatalog } from '../catalog';

const arenaRow = (fields: Partial<ArenaRow> = {}): ArenaRow => ({
  arenaId: '01_karelia',
  name: 'Karelia',
  nameEn: 'Karelia',
  nameKey: 'arenas:01_karelia/name',
  description: null,
  descriptionKey: 'arenas:01_karelia/description',
  localized: {},
  slug: 'karelia',
  sizeMeters: 1000,
  modes: ['ctf'],
  image: 'https://x/karelia.webp',
  data: {},
  ...fields
});

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

  it('keeps a stored vehicle name and slug on update when the name is not localized', async () => {
    const prisma = createPrisma();

    await writeCatalog({ prisma, plan: plan({ vehicles: [vehicleRow(1, { localized: {} })] }) });

    const [upsert] = prisma.vehicle.upsert.mock.calls[0] ?? [];

    expect(upsert?.create).toMatchObject({ name: 'Tank 1', slug: 'tank-1' });
    expect(upsert?.update).not.toHaveProperty('name');
    expect(upsert?.update).not.toHaveProperty('shortName');
    expect(upsert?.update).not.toHaveProperty('description');
    expect(upsert?.update).not.toHaveProperty('slug');
  });

  it('replaces a stored tag-derived name with the localized one but never the slug', async () => {
    const prisma = createPrisma();
    const localized = { name: 'Объект 268 Вариант 4', shortName: 'Об. 268/4' };

    await writeCatalog({ prisma, plan: plan({ vehicles: [vehicleRow(1, { ...localized, localized })] }) });

    const [upsert] = prisma.vehicle.upsert.mock.calls[0] ?? [];

    expect(upsert?.create).toMatchObject(localized);
    expect(upsert?.update).toMatchObject(localized);
    expect(upsert?.update).not.toHaveProperty('description');
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
      localized: {},
      tankIds: [],
      data: {}
    };

    await writeCatalog({ prisma, plan: plan({ provisions: [provision] }) });

    const [upsert] = prisma.provision.upsert.mock.calls[0] ?? [];

    expect(upsert?.create).toMatchObject({ name: 'Rammer', description: 'Faster reload' });
    expect(upsert?.update).not.toHaveProperty('name');
    expect(upsert?.update).not.toHaveProperty('description');
  });

  it('replaces a stored provision name with the localized one and fills a missing image', async () => {
    const prisma = createPrisma();
    const image = 'https://raw.githubusercontent.com/unicum-gg/wot.assets/Lesta/icon.png';
    const localized = { name: 'Повышение жизнеспособности модулей' };
    const provision: ProvisionRow = {
      provisionId: 2,
      name: localized.name,
      tag: 'role_mediumTank_pair_1_1',
      type: 'fieldModification',
      nameKey: 'artefacts:role_mediumTank_pair_1_1/name',
      image,
      localized,
      tankIds: [],
      data: {}
    };

    await writeCatalog({ prisma, plan: plan({ provisions: [provision] }) });

    const [upsert] = prisma.provision.upsert.mock.calls[0] ?? [];

    expect(upsert?.create).toMatchObject({ ...localized, image, nameKey: provision.nameKey });
    expect(upsert?.update).toMatchObject({ ...localized, image, nameKey: provision.nameKey });
  });

  it('keeps a stored provision image', async () => {
    const prisma = createPrisma();

    prisma.provision.findMany.mockResolvedValue([mock<Provision>({ provisionId: 3 })]);

    await writeCatalog({
      prisma,
      plan: plan({
        provisions: [
          { provisionId: 3, name: 'Rammer', tag: 'rammer', type: 'optionalDevice', image: 'https://x/icon.png', localized: {}, tankIds: [], data: {} }
        ]
      })
    });

    expect(prisma.provision.upsert.mock.calls[0]?.[0].update).not.toHaveProperty('image');
  });

  it('drops relative provision images that cannot be served', async () => {
    const prisma = createPrisma();

    await writeCatalog({ prisma, plan: plan() });

    expect(prisma.provision.updateMany.mock.calls[0]?.[0]).toMatchObject({
      where: { NOT: { image: { startsWith: 'http' } } },
      data: { image: null }
    });
  });

  it('replaces a stored arena name with the localized one and fills a missing English name', async () => {
    const prisma = createPrisma();
    const localized = { name: 'Карелия', description: 'Скалистые холмы' };

    await writeCatalog({ prisma, plan: plan({ arenas: [arenaRow({ ...localized, localized })] }) });

    const [upsert] = prisma.arena.upsert.mock.calls[0] ?? [];

    expect(upsert?.create).toMatchObject({ ...localized, nameEn: 'Karelia', slug: 'karelia' });
    expect(upsert?.update).toMatchObject({ ...localized, nameEn: 'Karelia', nameKey: 'arenas:01_karelia/name' });
    expect(upsert?.update).not.toHaveProperty('slug');
  });

  it('keeps a stored arena name and English name when nothing is localized', async () => {
    const prisma = createPrisma();

    prisma.arena.findMany.mockResolvedValue([mock<Arena>({ arenaId: '01_karelia' })]);

    await writeCatalog({ prisma, plan: plan({ arenas: [arenaRow()] }) });

    const [upsert] = prisma.arena.upsert.mock.calls[0] ?? [];

    expect(upsert?.update).not.toHaveProperty('name');
    expect(upsert?.update).not.toHaveProperty('nameEn');
    expect(upsert?.update).not.toHaveProperty('description');
  });
});
