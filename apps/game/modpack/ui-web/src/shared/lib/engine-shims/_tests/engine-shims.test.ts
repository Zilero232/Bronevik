// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';

import type { EngineScope } from '../engine-shims.types';

import { describeEngine, installEngineShims } from '../engine-shims';

const flush = (): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, 0);
  });

const browserDocument = Object.assign(new EventTarget(), { onfocusout: null });

describe(installEngineShims, () => {
  it('adds queueMicrotask and a microtask setImmediate to an engine that has neither nor MessageChannel', () => {
    const scope: EngineScope = {};

    expect(installEngineShims({ scope, document: browserDocument })).toEqual(['queueMicrotask', 'setImmediate']);
  });

  it('leaves a browser with MessageChannel and queueMicrotask alone', () => {
    const scope: EngineScope = { MessageChannel: class {}, queueMicrotask: () => undefined };

    expect(installEngineShims({ scope, document: browserDocument })).toEqual([]);
  });

  it('runs a shimmed setImmediate callback before the next timer', async () => {
    const scope: EngineScope = {};
    const order: string[] = [];

    installEngineShims({ scope, document: browserDocument });
    setTimeout(() => order.push('timer'), 0);

    if (typeof scope.setImmediate === 'function') {
      scope.setImmediate(() => order.push('immediate'));
    }

    await flush();

    expect(order).toEqual(['immediate', 'timer']);
  });

  it('hides a null window.event, which React reads as the current event', () => {
    const scope: EngineScope = { MessageChannel: class {}, queueMicrotask: () => undefined, event: null };

    expect(installEngineShims({ scope, document: browserDocument })).toEqual(['event']);
    expect(scope.event).toBeUndefined();
  });

  it('turns focus and blur into bubbling focusin and focusout when the engine lacks them', () => {
    const scope: EngineScope = { MessageChannel: class {}, queueMicrotask: () => undefined };
    const engineDocument = new EventTarget();
    const seen: string[] = [];

    engineDocument.addEventListener('focusout', (event) => seen.push(event.type));

    const installed = installEngineShims({ scope, document: engineDocument });

    engineDocument.dispatchEvent(new FocusEvent('blur'));

    expect(installed).toEqual(['focusout']);
    expect(seen).toEqual(['focusout']);
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
