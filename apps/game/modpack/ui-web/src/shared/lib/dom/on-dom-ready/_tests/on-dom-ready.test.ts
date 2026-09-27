// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';

import { DOM } from '../../../../config';
import { onDomReady } from '../on-dom-ready';

const setReadyState = (state: DocumentReadyState): void => {
  Object.defineProperty(document, 'readyState', { configurable: true, get: () => state });
};

afterEach(() => {
  Reflect.deleteProperty(document, 'readyState');
});

describe(onDomReady, () => {
  it('runs at once when the document is already parsed', () => {
    const callback = vi.fn();

    setReadyState('interactive');
    onDomReady(callback);

    expect(callback).toHaveBeenCalledOnce();
  });

  it('waits for the DOM while the document is loading and runs once', () => {
    const callback = vi.fn();

    setReadyState('loading');
    onDomReady(callback);

    expect(callback).not.toHaveBeenCalled();

    document.dispatchEvent(new Event(DOM.readyEvent));
    document.dispatchEvent(new Event(DOM.readyEvent));

    expect(callback).toHaveBeenCalledOnce();
  });
});
