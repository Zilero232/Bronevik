import type { LestaMockHandler } from '../../lesta-mock.types';

export type MockRequestInput = {
  handler: LestaMockHandler;
  url: string;
  body: string;
  now: number;
};

export type CreateMockFetchInput = {
  handler: LestaMockHandler;
  clock?: () => number;
};

export type MockServerInput = {
  handler: LestaMockHandler;
  baseUrl: string;
  onRealHost: (url: string) => void;
};
