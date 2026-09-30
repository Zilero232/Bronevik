export type EngineScope = {
  MessageChannel?: unknown;
  setImmediate?: unknown;
  queueMicrotask?: unknown;
  event?: unknown;
};

export type EngineShim = 'event' | 'focusout' | 'queueMicrotask' | 'setImmediate';

export type InstallEngineShimsInput = {
  scope: EngineScope;
  document: EventTarget;
};

export type DescribeEngineInput = {
  scope: EngineScope;
  document: object;
  installed: readonly EngineShim[];
};
