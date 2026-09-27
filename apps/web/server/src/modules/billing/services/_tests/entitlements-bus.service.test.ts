import RedisMock from 'ioredis-mock';
import { firstValueFrom, take, toArray } from 'rxjs';
import { describe, expect, it } from 'vitest';

import type { EntitlementChange } from '../../billing.types';

import { EntitlementsBusService } from '../entitlements-bus.service';

describe('EntitlementsBusService', () => {
  it('tells its own process about a change as local and every other process as remote', async () => {
    const redis = new RedisMock();
    const api = new EntitlementsBusService(redis);
    const worker = new EntitlementsBusService(redis);

    await Promise.all([api.onModuleInit(), worker.onModuleInit()]);

    const onApi = firstValueFrom(api.changes$.pipe(take(1), toArray()));
    const onWorker = firstValueFrom(worker.changes$.pipe(take(1)));

    worker.publish('u1');

    await expect(onWorker).resolves.toEqual<EntitlementChange>({ userId: 'u1', isLocal: true });
    await expect(onApi).resolves.toEqual<EntitlementChange[]>([{ userId: 'u1', isLocal: false }]);

    await Promise.all([api.onModuleDestroy(), worker.onModuleDestroy()]);
  });
});
