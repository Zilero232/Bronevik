import { describe, expect, it } from 'vitest';

import { serverEnvSchema } from '../server-env.schemas';

const TOKEN = 'x'.repeat(32);

describe('serverEnvSchema', () => {
  it('requires an internal API token and has no fallback for it', () => {
    expect(serverEnvSchema.safeParse({ LESTA_NOTICE: 'false' }).success).toBe(false);
    expect(serverEnvSchema.safeParse({ INTERNAL_API_TOKEN: 'short', LESTA_NOTICE: 'false' }).success).toBe(false);
    expect(serverEnvSchema.parse({ INTERNAL_API_TOKEN: TOKEN, LESTA_NOTICE: 'false' }).INTERNAL_API_TOKEN).toHaveLength(32);
  });

  it('requires the Lesta notice switch as true or false', () => {
    expect(serverEnvSchema.safeParse({ INTERNAL_API_TOKEN: TOKEN }).success).toBe(false);
    expect(serverEnvSchema.safeParse({ INTERNAL_API_TOKEN: TOKEN, LESTA_NOTICE: 'yes' }).success).toBe(false);
    expect(serverEnvSchema.parse({ INTERNAL_API_TOKEN: TOKEN, LESTA_NOTICE: 'true' }).LESTA_NOTICE).toBe(true);
    expect(serverEnvSchema.parse({ INTERNAL_API_TOKEN: TOKEN, LESTA_NOTICE: 'false' }).LESTA_NOTICE).toBe(false);
  });
});
