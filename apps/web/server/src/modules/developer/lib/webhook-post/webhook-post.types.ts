import type { IncomingMessage } from 'node:http';

export type PostWebhookInput = {
  url: string;
  body: string;
  headers: Record<string, string>;
  address: string;
  timeoutMs: number;
  maxBodyBytes: number;
};

export type WebhookResponse = {
  status: number;
  body: string;
};

export type ReadLimitedInput = {
  response: IncomingMessage;
  maxBodyBytes: number;
};
