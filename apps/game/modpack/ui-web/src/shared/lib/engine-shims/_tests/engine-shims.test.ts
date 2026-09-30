import { describe, expect, it } from 'vitest';

import type { EngineScope } from '../engine-shims.types';

import { describeEngine, installEngineShims } from '../engine-shims';

const flush = (): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, 0);
  });

describe(installEngineShims, () => {
  it('adds queueMicrotask and a microtask setImmediate to an engine that has neither nor MessageChannel', () => {
    const scope: EngineScope = {};

    expect(installEngineShims(scope)).toEqual(['queueMicrotask', 'setImmediate']);
  });

  it('leaves a browser with MessageChannel and queueMicrotask alone', () => {
    const scope: EngineScope = { MessageChannel: class {}, queueMicrotask: () => undefined };

    expect(installEngineShims(scope)).toEqual([]);
  });

  it('runs a shimmed setImmediate callback before the next timer', async () => {
    const scope: EngineScope = {};
    const order: string[] = [];

    installEngineShims(scope);
    setTimeout(() => order.push('timer'), 0);

    if (typeof scope.setImmediate === 'function') {
      scope.setImmediate(() => order.push('immediate'));
    }

    await flush();

    expect(order).toEqual(['immediate', 'timer']);
  });

  it('hides a null window.event, which React reads as the current event', () => {
    const scope: EngineScope = { MessageChannel: class {}, queueMicrotask: () => undefined, event: null };

    expect(installEngineShims(scope)).toEqual(['event']);
    expect(scope.event).toBeUndefined();
  });
});

describe(describeEngine, () => {
  it('names the shims, the missing event handlers and host apis', () => {
    const text = describeEngine({
      scope: {},
      document: { oninput: null, onfocusin: null, onfocusout: null, onmouseover: null, onmouseout: null },
      installed: ['setImmediate']
    });

    expect(text).toBe('shims setImmediate; missing handlers onwheel; missing host apis MessageChannel,setImmediate,queueMicrotask; event undefined');
  });
});
