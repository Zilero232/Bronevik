import plan from '@contract/cache-plan.json';
import result from '@contract/cache-result.json';
import { describe, expect, it } from 'vitest';

import { cachePlanSchema, cacheResultSchema } from '@/features/settings/clear-cache';

describe('cachePlanSchema', () => {
  it('parses the cache folders the Rust core found, with their sizes', () => {
    const parsed = cachePlanSchema.parse(plan);

    expect(parsed.targets.map((target) => target.location)).toEqual(['app_data', 'game']);
    expect(parsed.totalBytes).toBe(parsed.targets.reduce((sum, target) => sum + target.sizeBytes, 0));
  });
});

describe('cacheResultSchema', () => {
  it('parses what was freed and what could not be cleared', () => {
    const parsed = cacheResultSchema.parse(result);

    expect(parsed.cleared).toEqual(['MirTankov/web_cache']);
    expect(parsed.failed).toEqual(['game/win64/Reports']);
  });
});
