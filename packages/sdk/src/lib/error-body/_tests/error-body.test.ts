import ky, { isHTTPError } from 'ky';
import { describe, expect, it } from 'vitest';

import { restoreErrorBody } from '../error-body';

const failWith = async (response: Response) => {
  const error: unknown = await ky('https://api.test/v1/players/1', {
    fetch: async () => response,
    retry: 0,
    hooks: { beforeError: [restoreErrorBody] }
  }).catch((caught: unknown) => caught);

  if (!isHTTPError(error)) {
    throw new TypeError('expected an HTTPError');
  }

  return error;
};

describe('restoreErrorBody', () => {
  it('puts the parsed JSON error back into a readable response', async () => {
    const error = await failWith(Response.json({ code: 'RATE_LIMITED' }, { status: 429 }));

    expect(await error.response.json()).toEqual({ code: 'RATE_LIMITED' });
  });

  it('keeps the status and headers', async () => {
    const error = await failWith(new Response('slow down', { status: 429, headers: { 'retry-after': '3' } }));

    expect(error.response.status).toBe(429);
    expect(error.response.headers.get('retry-after')).toBe('3');
    expect(await error.response.text()).toBe('slow down');
  });

  it('answers an empty body when the error had none', async () => {
    const error = await failWith(new Response(null, { status: 503 }));

    expect(await error.response.text()).toBe('');
  });

  it('passes other errors through untouched', async () => {
    const failure = new TypeError('network down');
    const error: unknown = await ky('https://api.test/v1/players/1', {
      fetch: async () => {
        throw failure;
      },
      retry: 0,
      hooks: { beforeError: [restoreErrorBody] }
    }).catch((caught: unknown) => caught);

    expect(error).not.toSatisfy(isHTTPError);
  });
});
