import type { LestaMockEnvelope, LestaMockParams, MockWorld } from '../../lesta-mock.types';

export type MockContext = {
  world: MockWorld;
  method: string;
  params: LestaMockParams;
  now: number;
  fields: string[];
  extra: string[];
  tokenAccountId: number | null;
  hasToken: boolean;
  loginUrl: string;
};

export type MockRoute = (context: MockContext) => LestaMockEnvelope;

export type FailInput = {
  code: number;
  message: string;
  field?: string | null;
  value?: string | null;
};

export type IdListInput = {
  params: LestaMockParams;
  field: string;
  required?: boolean;
  limit?: number;
};

export type IdListResult = { error: LestaMockEnvelope } | { ids: number[] };
