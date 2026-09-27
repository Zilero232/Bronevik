import type { IncomingMessage, ServerResponse } from 'node:http';

import { describe, expect, it } from 'vitest';
import { mock } from 'vitest-mock-extended';

import { LOGGER } from '../logger.constants';
import { isQuietRequest, requestId, serializeRequest } from '../logger.serializers';

const request = (input: Partial<IncomingMessage>) => mock<IncomingMessage>({ headers: {}, ...input });

describe('serializeRequest', () => {
  it('drops the query string and every header', () => {
    const serialized = serializeRequest(
      Object.assign(request({ method: 'GET', url: '/players?token=secret', headers: { authorization: 'Bearer x' } }), { id: 'req-1' })
    );

    expect(serialized).toEqual({ id: 'req-1', method: 'GET', url: '/players' });
  });
});

describe('isQuietRequest', () => {
  it('silences the health probe', () => {
    expect(LOGGER.http.quietPaths.every((path) => isQuietRequest(request({ url: `${path}?probe=1` })))).toBe(true);
  });

  it('logs every other path', () => {
    expect(isQuietRequest(request({ url: '/players' }))).toBe(false);
  });
});

describe('requestId', () => {
  it('reuses an incoming request id and echoes it back', () => {
    const response = mock<ServerResponse>();
    const id = requestId({ request: request({ headers: { [LOGGER.http.requestIdHeader]: 'abc' } }), response });

    expect(id).toBe('abc');
    expect(response.setHeader).toHaveBeenCalledWith(LOGGER.http.requestIdHeader, 'abc');
  });

  it.each([
    ['too long', 'a'.repeat(65)],
    ['carrying a line break', 'abc\ninjected'],
    ['carrying markup', '<script>'],
    ['empty', '']
  ])('replaces an incoming request id that is %s', (_label, incoming) => {
    const response = mock<ServerResponse>();
    const id = requestId({ request: request({ headers: { [LOGGER.http.requestIdHeader]: incoming } }), response });

    expect(id).not.toBe(incoming);
    expect(response.setHeader).toHaveBeenCalledWith(LOGGER.http.requestIdHeader, id);
  });

  it('generates an id when the client sent none', () => {
    const id = requestId({ request: request({}), response: mock<ServerResponse>() });

    expect(id).not.toBe('');
  });
});
