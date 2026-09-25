import { describe, expect, it } from 'vitest';
import { z } from 'zod';

import { LESTA_API } from '../client.constants';
import { callParams, fieldAwareSchema, fieldsParam, toSearchParams } from '../client.helpers';

describe('client helpers', () => {
  it('joins lists and leaves empty lists out', () => {
    expect(fieldsParam(['a', 'b'])).toBe('a,b');
    expect(fieldsParam([])).toBeUndefined();
    expect(fieldsParam(undefined)).toBeUndefined();
  });

  it('refuses more fields than Lesta accepts', () => {
    const fields = Array.from({ length: LESTA_API.maxFields + 1 }, (_, index) => `f${index}`);

    expect(() => fieldsParam(fields)).toThrow(RangeError);
    expect(fieldsParam(fields.slice(1))).toContain(LESTA_API.listSeparator);
  });

  it('maps call options onto Lesta parameter names', () => {
    expect(callParams({ language: 'en', accessToken: 't', extra: ['x'], fields: ['y'] })).toEqual({
      language: 'en',
      access_token: 't',
      extra: 'x',
      fields: 'y'
    });
  });

  it('serialises scalars and lists and drops empty values', () => {
    const search = toSearchParams({ a: 1, b: true, c: [1, 2], d: [], e: null, f: undefined, g: 'text' });

    expect(Object.fromEntries(search)).toEqual({ a: '1', b: 'true', c: '1,2', g: 'text' });
  });

  it('validates the full schema only when no fields narrow the payload', () => {
    const schema = z.object({ id: z.number(), name: z.string() });

    expect(fieldAwareSchema({ schema, fields: undefined }).safeParse({ id: 1 }).success).toBe(false);
    expect(fieldAwareSchema({ schema, fields: ['id'] }).safeParse({ id: 1 }).success).toBe(true);
  });
});
