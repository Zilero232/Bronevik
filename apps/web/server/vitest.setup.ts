import RedisMock from 'ioredis-mock';
import { beforeEach } from 'vitest';

import 'reflect-metadata';

beforeEach(async () => {
  await new RedisMock().flushall();
});
