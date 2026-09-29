import offlinePlan from '@contract/install-plan-offline.json';
import plan from '@contract/install-plan.json';
import { describe, expect, it } from 'vitest';

import { installPlanSchema } from '@/features/setup/install-modpack';

import { installBlocker } from '../install-blocker';

const ready = installPlanSchema.parse(plan);
const offline = installPlanSchema.parse(offlinePlan);

describe('installBlocker', () => {
  it('lets a supported client with a release and a catalog install', () => {
    expect(installBlocker(ready)).toBeNull();
  });

  it('blocks a first install without a connection as offline', () => {
    expect(installBlocker(offline)).toBe('offline');
  });

  it('blocks a client no release supports yet', () => {
    expect(installBlocker({ ...ready, source: 'unavailable' })).toBe('unavailable');
  });

  it('blocks a release whose catalog has not been downloaded', () => {
    expect(installBlocker({ ...ready, catalog: null })).toBe('noCatalog');
  });

  it('blocks an unsupported client before anything else', () => {
    expect(installBlocker({ ...offline, client: { ...offline.client, problem: 'not_lesta' } })).toBe('client');
  });
});
