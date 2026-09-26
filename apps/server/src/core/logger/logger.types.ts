import type { IncomingMessage, ServerResponse } from 'node:http';

export type LoggedRequest = IncomingMessage & { id?: unknown };

export type RequestIdInput = {
  request: IncomingMessage;
  response: ServerResponse;
};
