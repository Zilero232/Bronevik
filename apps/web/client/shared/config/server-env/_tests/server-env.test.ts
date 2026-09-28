import { describe, expect, it } from 'vitest';

import { serverEnvSchema } from '../server-env.schemas';

describe('serverEnvSchema', () => {
  it('requires an internal API token and has no fallback for it', () => {
    expect(serverEnvSchema.safeParse({}).success).toBe(false);
    expect(serverEnvSchema.safeParse({ INTERNAL_API_TOKEN: 'short' }).success).toBe(false);
    expect(serverEnvSchema.parse({ INTERNAL_API_TOKEN: 'x'.repeat(32) }).INTERNAL_API_TOKEN).toHaveLength(32);
  });
});
