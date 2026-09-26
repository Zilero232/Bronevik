import { act, renderHook } from '@testing-library/react';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { afterAll, afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { REDUCED_MOTION_QUERY } from '../../../../lib/showcase-environment';
import { useShowcaseMode } from '../use-showcase-mode';

vi.hoisted(() => vi.resetModules());

const media = { reducedMotion: false, listeners: new Set<EventListenerOrEventListenerObject>() };

const originalGetContext = Object.getOwnPropertyDescriptor(HTMLCanvasElement.prototype, 'getContext');

const setReducedMotion = (reducedMotion: boolean) => {
  media.reducedMotion = reducedMotion;
  media.listeners.forEach((listener) => (typeof listener === 'function' ? listener(new Event('change')) : listener.handleEvent(new Event('change'))));
};

beforeEach(() => {
  Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', { value: () => ({}), configurable: true });

  vi.spyOn(window, 'matchMedia').mockImplementation((query) => ({
    matches: query === REDUCED_MOTION_QUERY && media.reducedMotion,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: (_type: string, listener: EventListenerOrEventListenerObject) => {
      media.listeners.add(listener);
    },
    removeEventListener: (_type: string, listener: EventListenerOrEventListenerObject) => {
      media.listeners.delete(listener);
    },
    dispatchEvent: vi.fn()
  }));
});

afterEach(() => {
  vi.restoreAllMocks();
  media.reducedMotion = false;
  media.listeners.clear();
  Reflect.deleteProperty(navigator, 'connection');

  if (originalGetContext) {
    Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', originalGetContext);
  }
});

afterAll(() => {
  vi.resetModules();
});

describe('useShowcaseMode', () => {
  it('spins the model live on a capable device', () => {
    const { result } = renderHook(() => useShowcaseMode());

    expect(result.current).toBe('live');
  });

  it('holds the model still for users who prefer reduced motion', () => {
    setReducedMotion(true);

    const { result } = renderHook(() => useShowcaseMode());

    expect(result.current).toBe('still');
  });

  it('follows a reduced-motion change made while the page is open', () => {
    const { result } = renderHook(() => useShowcaseMode());

    act(() => setReducedMotion(true));

    expect(result.current).toBe('still');
  });

  it('falls back to the flat picture when the user saves data', () => {
    Object.defineProperty(navigator, 'connection', { value: { saveData: true }, configurable: true });

    const { result } = renderHook(() => useShowcaseMode());

    expect(result.current).toBe('flat');
  });

  it('decides nothing while rendering on the server', () => {
    const Probe = () => String(useShowcaseMode());

    expect(renderToString(createElement(Probe))).toBe('null');
  });

  it('stops listening once unmounted', () => {
    const { unmount } = renderHook(() => useShowcaseMode());

    unmount();

    expect(media.listeners.size).toBe(0);
  });
});
