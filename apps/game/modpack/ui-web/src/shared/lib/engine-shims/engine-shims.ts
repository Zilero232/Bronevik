import type { DescribeEngineInput, EngineScope, EngineShim } from './engine-shims.types';

import { ENGINE_PROBE } from './engine-shims.constants';

const microtask = (callback: () => void): void => {
  void Promise.resolve()
    .then(callback)
    .catch((error: unknown) => {
      setTimeout(() => {
        throw error;
      }, 0);
    });
};

const hideNullEvent = (scope: EngineScope): boolean => {
  try {
    Object.defineProperty(scope, 'event', { configurable: true, get: () => undefined });

    return true;
  } catch {
    return false;
  }
};

export const installEngineShims = (scope: EngineScope): EngineShim[] => {
  const installed: EngineShim[] = [];

  if (typeof scope.queueMicrotask !== 'function') {
    scope.queueMicrotask = microtask;
    installed.push('queueMicrotask');
  }

  if (typeof scope.setImmediate !== 'function' && scope.MessageChannel === undefined) {
    scope.setImmediate = microtask;
    installed.push('setImmediate');
  }

  if (scope.event === null && hideNullEvent(scope)) {
    installed.push('event');
  }

  return installed;
};

export const describeEngine = ({ scope, document, installed }: DescribeEngineInput): string => {
  const handlers = ENGINE_PROBE.handlers.filter((name) => !(name in document));
  const hosts = ENGINE_PROBE.hosts.filter((name) => scope[name] === undefined);

  return [
    `shims ${installed.join(',') || 'none'}`,
    `missing handlers ${handlers.join(',') || 'none'}`,
    `missing host apis ${hosts.join(',') || 'none'}`,
    `event ${scope.event === null ? 'null' : typeof scope.event}`
  ].join('; ');
};
