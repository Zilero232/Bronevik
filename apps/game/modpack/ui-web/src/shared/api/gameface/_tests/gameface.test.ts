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

  it('sends a message through the model command and hears the next state', async () => {
    const { mock, bridge } = mockBridge((message) => `after ${message}`);
    const states: (string | null)[] = [];

    bridge.onDataChanged(() => states.push(bridge.state()));
    await Promise.resolve();

    expect(bridge.send('ping')).toBe(true);
    expect(mock.sent()).toEqual(['ping']);
    expect(states).toEqual(['initial', 'after ping']);
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
    const bridge = createGamefaceBridge({ model: { other: 1 }, subViews: { a: { model: { open: vi.fn() } }, b: { model } } });

    expect(bridge.openWindow()).toBe(true);
    expect(model[GAMEFACE.button.open]).toHaveBeenCalledOnce();
  });

  it('opens the window through the page model itself', () => {
    const model = buttonModel();

    expect(createGamefaceBridge({ model }).openWindow()).toBe(true);
    expect(model[GAMEFACE.button.open]).toHaveBeenCalledOnce();
  });

  it('ignores models without the marker or the command', () => {
    vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    expect(createGamefaceBridge({ model: { open: vi.fn() } }).openWindow()).toBe(false);
    expect(createGamefaceBridge({ model: { [GAMEFACE.button.marker]: GAMEFACE.button.markerValue } }).openWindow()).toBe(false);
    expect(createGamefaceBridge({}).openWindow()).toBe(false);
  });
});
