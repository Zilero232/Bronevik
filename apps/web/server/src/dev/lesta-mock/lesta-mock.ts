import { Logger } from '@nestjs/common';

import type { Env } from '../../config';
import type { MockCatalog, MockWorld } from './lesta-mock.types';

import { createPrismaClient } from '../../core';
import { loadMockCatalog } from './lib/catalog';
import { createLoginRouter } from './lib/login';
import { createLestaMockHandler } from './lib/responses';
import { startLestaMockServer } from './lib/transport';
import { createMockWorld } from './lib/world';

const logger = new Logger('LestaMock');

export const loadMockWorld = async (databaseUrl: string): Promise<MockWorld> => {
  const prisma = createPrismaClient({ url: databaseUrl, pool: { max: 2 } });

  try {
    const catalog: MockCatalog = await loadMockCatalog(prisma);

    return createMockWorld({ catalog });
  } finally {
    await prisma.$disconnect();
  }
};

const ACTIVE_SERVER = Symbol.for('otmetki.lestaMock.server');

const closePrevious = () => {
  const previous: unknown = Reflect.get(globalThis, ACTIVE_SERVER);

  if (previous && typeof previous === 'object' && 'close' in previous && typeof previous.close === 'function') {
    previous.close();
  }
};

export const startLestaMock = async (env: Pick<Env, 'API_URL' | 'DATABASE_URL'>) => {
  const world = await loadMockWorld(env.DATABASE_URL);
  const handler = createLestaMockHandler(world);

  closePrevious();

  const server = startLestaMockServer({
    handler,
    baseUrl: env.API_URL,
    onRealHost: (url) => logger.error(`blocked a real Lesta API call while the mock is on: ${url}`)
  });

  Reflect.set(globalThis, ACTIVE_SERVER, server);

  logger.warn(
    `LESTA_APPLICATION_ID is empty: serving a generated Lesta API (${world.players.length} players, ${world.clans.length} clans, ${world.catalog.vehicles.length} vehicles). Set the key to switch it off.`
  );

  if (!world.catalog.vehicles.some((vehicle) => vehicle.playable)) {
    logger.error(
      'no vehicle has WN8 expected values, so every generated garage is empty: run the reference wn8Expected job (or `bun run dev:seed`).'
    );
  }

  return { world, handler, server, loginRouter: createLoginRouter({ world, apiUrl: env.API_URL }) };
};
