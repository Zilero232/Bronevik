import { afterEach, describe, expect, it, vi } from 'vitest';

import { createGamefaceBridge } from '../gameface';
import { GAMEFACE } from '../gameface.constants';
import { createGamefaceMock } from '../mock';

const SIZE = { width: 2560, height: 1440 };

const mockBridge = (onSend: (message: string) => string | null = () => null) => {
  const mock = createGamefaceMock({ state: 'initial', clientSize: () => SIZE, onSend });

  return { mock, bridge: createGamefaceBridge(mock.scope) };
};

const buttonModel = () => ({ [GAMEFACE.button.marker]: GAMEFACE.button.markerValue, [GAMEFACE.button.open]: vi.fn() });

afterEach(() => {
  vi.restoreAllMocks();
});

describe(createGamefaceBridge, () => {
  it('reads the state and the client size from the Gameface globals', () => {
    const { bridge } = mockBridge();

    expect(bridge.state()).toBe('initial');
    expect(bridge.clientSize()).toEqual(SIZE);
  });

  it('reads the feed property and hears a feed the mock pushes', async () => {
    const mock = createGamefaceMock({ state: 'initial', feed: 'first', clientSize: () => SIZE, onSend: () => ({ feed: 'second' }) });
    const bridge = createGamefaceBridge(mock.scope);
    const feeds: (string | null)[] = [];

    bridge.onDataChanged(() => feeds.push(bridge.feed()));
    await Promise.resolve();
    bridge.send('watch');

    expect(feeds).toEqual(['first', 'second']);
    expect(bridge.state()).toBe('initial');
  });

  it('sends a message through the model command and hears the next state', async () => {
    const { mock, bridge } = mockBridge((message) => `after ${message}`);
    const states: (string | null)[] = [];

    bridge.onDataChanged(() => states.push(bridge.state()));
    await Promise.resolve();

    expect(bridge.send('ping')).toBe(true);
    expect(mock.sent()).toEqual(['ping']);
    expect(states).toEqual(['initial', 'after ping']);
  });

  it('sizes the view to the client when the view can be resized', () => {
    const resize = vi.fn();
    const bridge = createGamefaceBridge({ viewEnv: { [GAMEFACE.viewEnv.resizeView]: resize } });

    expect(bridge.resizeView(SIZE)).toBe(true);
    expect(resize).toHaveBeenCalledWith(SIZE.width, SIZE.height);
    expect(createGamefaceBridge({}).resizeView(SIZE)).toBe(false);
  });

  it('reports a missing model instead of throwing', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const bridge = createGamefaceBridge({});

    expect(bridge.send('ping')).toBe(false);
    expect(bridge.state()).toBeNull();
    expect(bridge.clientSize()).toBeNull();
    expect(warn).toHaveBeenCalledOnce();
  });

  it('opens the window through the marked model among the page sub views', () => {
    const model = buttonModel();
    const views: Record<string, unknown> = { a: { model: { open: vi.fn() } }, b: { model } };
    const bridge = createGamefaceBridge({ model: { other: 1 }, subViews: { ids: () => Object.keys(views), get: (id: string) => views[id] } });

    expect(bridge.openWindow()).toBe(true);
    expect(model[GAMEFACE.button.open]).toHaveBeenCalledOnce();
  });

  it('opens the window through the page model itself', () => {
    const model = buttonModel();

    expect(createGamefaceBridge({ model }).openWindow()).toBe(true);
    expect(model[GAMEFACE.button.open]).toHaveBeenCalledOnce();
  });

  it('hears only the data changes of the callback it registered', async () => {
    const listeners: ((data: unknown, indexes: unknown, ids: unknown) => void)[] = [];
    const register = vi.fn(() => 4);
    const seen = vi.fn();
    const bridge = createGamefaceBridge({
      engine: { whenReady: Promise.resolve(), on: (_event: string, listener: (typeof listeners)[number]) => listeners.push(listener) },
      viewEnv: { addDataChangedCallback: register }
    });

    bridge.onDataChanged(seen);
    await Promise.resolve();
    listeners[0]?.({}, [], [9]);
    listeners[0]?.({}, [], [4]);

    expect(register).toHaveBeenCalledWith('model', 0, true);
    expect(seen).toHaveBeenCalledTimes(2);
  });

  it('limits the input area of the view', () => {
    const { mock, bridge } = mockBridge();

    expect(bridge.setInputArea({ left: 1, top: 2, width: 3, height: 4 })).toBe(true);
    expect(mock.inputAreas()).toEqual([[1, 2, 3, 4]]);
    expect(createGamefaceBridge({}).setInputArea({ left: 0, top: 0, width: 0, height: 0 })).toBe(false);
  });

  it('ignores models without the marker or the command', () => {
    vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    expect(createGamefaceBridge({ model: { open: vi.fn() } }).openWindow()).toBe(false);
    expect(createGamefaceBridge({ model: { [GAMEFACE.button.marker]: GAMEFACE.button.markerValue } }).openWindow()).toBe(false);
    expect(createGamefaceBridge({}).openWindow()).toBe(false);
  });
});
