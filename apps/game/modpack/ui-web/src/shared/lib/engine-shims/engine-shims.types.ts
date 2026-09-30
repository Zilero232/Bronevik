export type EngineScope = {
  MessageChannel?: unknown;
  setImmediate?: unknown;
  queueMicrotask?: unknown;
  event?: unknown;
};

export type EngineShim = 'event' | 'queueMicrotask' | 'setImmediate';

export type DescribeEngineInput = {
  scope: EngineScope;
  document: object;
  installed: readonly EngineShim[];
};
