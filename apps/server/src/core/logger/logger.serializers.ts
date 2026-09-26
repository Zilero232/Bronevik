import type { IncomingMessage, ServerResponse } from 'node:http';

import { randomUUID } from 'node:crypto';

import type { LoggedRequest, RequestIdInput } from './logger.types';

import { LOGGER } from './logger.constants';

const pathOf = (url: string | undefined): string => (url ?? '').split('?')[0] ?? '';

export const serializeRequest = (request: LoggedRequest) => ({ id: request.id, method: request.method, url: pathOf(request.url) });

export const serializeResponse = (response: ServerResponse) => ({ statusCode: response.statusCode });

const quietPaths = new Set<string>(LOGGER.http.quietPaths);

export const isQuietRequest = (request: IncomingMessage): boolean => quietPaths.has(pathOf(request.url));

export const requestId = ({ request, response }: RequestIdInput): string => {
  const incoming = request.headers[LOGGER.http.requestIdHeader];
  const id = typeof incoming === 'string' && incoming !== '' ? incoming : randomUUID();

  response.setHeader(LOGGER.http.requestIdHeader, id);

  return id;
};
