import { Logger } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

import type { CreatePgPoolInput, CreatePrismaClientInput } from './prisma.types';

import { PrismaClient } from '../../../generated';
import { PRISMA_POOL } from './prisma.constants';

const logger = new Logger('PgPool');

export const createPgPool = ({ url, pool }: CreatePgPoolInput): Pool => {
  const created = new Pool({ ...PRISMA_POOL, ...pool, connectionString: url });

  created.on('error', (error) => {
    logger.warn(`idle connection dropped: ${error.message}`);
  });

  return created;
};

export const createPrismaClient = ({ url, pool, log = ['error'] }: CreatePrismaClientInput): PrismaClient =>
  new PrismaClient({ adapter: new PrismaPg(createPgPool({ url, pool })), log });
