import { describe, expect, it } from 'vitest';

import { apiErrorCodeSchema, apiErrorSchema } from '../errors.schemas';

describe('apiErrorSchema', () => {
  it('keeps every known code', () => {
    for (const code of apiErrorCodeSchema.options) {
      expect(apiErrorSchema.parse({ error: 'nope', code }).code).toBe(code);
    }
  });

  it('degrades an unknown or missing code to an internal error', () => {
    expect(apiErrorSchema.parse({ error: 'nope', code: 'TEAPOT' }).code).toBe('INTERNAL_ERROR');
    expect(apiErrorSchema.parse({ error: 'nope' }).code).toBe('INTERNAL_ERROR');
  });

  it('still requires the error message', () => {
    expect(apiErrorSchema.safeParse({ code: 'NOT_FOUND' }).success).toBe(false);
  });
});
