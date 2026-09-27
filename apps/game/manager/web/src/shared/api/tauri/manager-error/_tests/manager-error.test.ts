import errorFixture from '@contract/error.json';
import { describe, expect, it } from 'vitest';
import { z } from 'zod';

import { ManagerError, toManagerError } from '../manager-error';
import { MANAGER_ERROR_CODES } from '../manager-error.constants';

describe('toManagerError', () => {
  it('reads the error shape the Rust commands serialise', () => {
    const error = toManagerError(errorFixture);

    expect(error).toBeInstanceOf(ManagerError);
    expect(error.code).toBe(errorFixture.code);
    expect(error.message).toBe(errorFixture.message);
  });

  it('keeps an unknown code readable instead of failing', () => {
    expect(toManagerError({ code: 'brand_new', message: 'x' }).code).toBe('unknown');
  });

  it('marks a response that broke the contract', () => {
    expect(toManagerError(new z.ZodError([])).code).toBe('contract');
  });

  it('wraps anything else as unknown', () => {
    expect(toManagerError('boom')).toMatchObject({ code: 'unknown', message: 'boom' });
  });

  it('knows every code it can be handed', () => {
    expect(MANAGER_ERROR_CODES).toContain(errorFixture.code);
  });
});
