import type { ApiPlan, ApiUsageQuery, CreateApiKeyInput, CreateWebhookEndpointInput, UpdateWebhookEndpointInput } from '@bronevik/schemas';
import type { Request } from 'express';

import type { UsageCounters } from './lib';

export type AuthenticatedApiKey = {
  id: string;
  userId: string;
  plan: ApiPlan;
};

export type CachedApiKey = {
  key: AuthenticatedApiKey;
  hash: string;
  at: number;
};

export type ApiRequest = Request & {
  apiKey?: AuthenticatedApiKey;
};

export type OwnedKeyInput = {
  userId: string;
  id: string;
};

export type CreateKeyInput = CreateApiKeyInput & {
  userId: string;
};

export type UsageInput = OwnedKeyInput & ApiUsageQuery;

export type RecordUsageInput = {
  keyId: string;
  endpoint: string;
  latencyMs: number;
  failed: boolean;
};

export type RecordThrottledInput = {
  keyId: string;
  endpoint: string;
};

export type LogErrorInput = {
  keyId: string;
  method: string;
  path: string;
  status: number;
  code: string | null;
  message: string | null;
};

export type RateLimitState = {
  limit: number;
  remaining: number;
  dailyLimit: number;
  dailyRemaining: number;
};

export type CreateEndpointInput = CreateWebhookEndpointInput & {
  userId: string;
};

export type UpdateEndpointInput = UpdateWebhookEndpointInput & OwnedKeyInput;

export type DeliverInput = {
  deliveryId: string;
  attempt: number;
  isFinal: boolean;
};

export type FailDeliveryInput = {
  deliveryId: string;
  endpointId: string;
  attempt: number;
  responseStatus: number | null;
  responseBody: string | null;
  isFinal: boolean;
};

export type RejectInput = {
  error: unknown;
  code: 'PLAN_LIMIT_REACHED' | 'RATE_LIMITED';
  message: string;
};

export type LimiterInput = {
  plan: ApiPlan;
  window: 'day' | 'second';
};

export type AddUsageInput = {
  keyId: string;
  endpoint: string;
  counters: UsageCounters;
};

export type UsageBufferEntry = AddUsageInput & {
  day: string;
};
