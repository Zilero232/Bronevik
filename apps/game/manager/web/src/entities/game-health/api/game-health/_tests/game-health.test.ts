import health from '@contract/game-health.json';
import { describe, expect, it } from 'vitest';

import { healthReportSchema } from '@/entities/game-health';

describe('healthReportSchema', () => {
  it('parses the components the game failed to load', () => {
    const parsed = healthReportSchema.parse(health);

    expect(parsed.failures[0]).toMatchObject({ component: 'hit_log', kind: 'dependency', source: 'python_log' });
    expect(parsed.stale).toBe(false);
  });
});
