// @vitest-environment jsdom
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import * as z from 'zod/mini';

import { GAMEFACE } from '../../../../../../shared/api/gameface';
import { createGamefaceMock, installGamefaceMock } from '../../../../../../shared/api/gameface/mock';
import { renderHook } from '../../../../../../shared/lib/testing/render-hook';
import { useHudOverlay } from '../use-hud-overlay';

const sample = readFileSync(
  path.resolve(import.meta.dirname, '../../../../../../shared/api/hud-protocol/_tests/fixtures/hud-state.sample.json'),
  'utf8'
);

const sampleSchema = z.looseObject({ panels: z.array(z.record(z.string(), z.unknown())) });

const withState = (patch: Record<string, unknown>, panel: Record<string, unknown> = {}): string => {
  const state = sampleSchema.parse(JSON.parse(sample));

  return JSON.stringify({ ...state, ...patch, panels: state.panels.map((item) => ({ ...item, ...panel })) });
};

const install = (state: string) => {
  const mock = createGamefaceMock({ state, clientSize: () => ({ width: 1920, height: 1080 }), onSend: () => null });

  installGamefaceMock(mock);

  return mock;
};

const sent = (mock: ReturnType<typeof install>): unknown[] => mock.sent().map((message): unknown => JSON.parse(message));

const mounted: { unmount: () => void }[] = [];

const mount = async (state: string) => {
  const mock = install(state);
  const hook = renderHook(useHudOverlay);

  mounted.push(hook);

  await hook.settle();
  await hook.settle();

  return { mock, hook };
};

afterEach(() => {
  mounted.splice(0).forEach((hook) => hook.unmount());
  Object.values(GAMEFACE.globals).forEach((name) => Reflect.deleteProperty(globalThis, name));
  document.documentElement.style.fontSize = '';
  vi.useRealTimers();
});

describe(useHudOverlay, () => {
  it('announces itself and places the pushed labels on the client screen, hidden until measured', async () => {
    const { mock, hook } = await mount(sample);

    expect(sent(mock)).toEqual([{ type: 'ready' }]);

    const [label] = hook.current().labels;

    expect(label?.style).toEqual({ left: '20rem', top: '940rem', opacity: 0 });
    expect(label?.lines[0]?.runs[0]).toMatchObject({ kind: 'text', style: { color: '#F2EAD3' } });
    expect(hook.current().style).toEqual({ width: '1920rem', height: '1080rem' });
  });

  it('lets the mouse through and shows no frame until the edit modifier is held', async () => {
    const { mock, hook } = await mount(withState({ edit: false }));
    const [label] = hook.current().labels;

    expect(label).toMatchObject({ interactive: false, framed: false });

    hook.run(() => window.dispatchEvent(new MouseEvent('mousedown', { clientX: 20, clientY: 940, button: 0 })));
    hook.run(() => window.dispatchEvent(new MouseEvent('mouseup', { clientX: 50, clientY: 50 })));
    hook.run(() => window.dispatchEvent(new WheelEvent('wheel', { clientX: 20, clientY: 940, deltaY: -1, cancelable: true })));

    expect(sent(mock)).toHaveLength(1);
  });

  it('drags a label while the modifier is held and reports its new anchor, whatever element is under the pointer', async () => {
    const { mock, hook } = await mount(sample);
    const icon = document.createElement('img');

    document.body.append(icon);

    expect(hook.current().labels[0]).toMatchObject({ interactive: true, framed: true });

    const press = new MouseEvent('mousedown', { clientX: 20, clientY: 940, button: 0, bubbles: true, cancelable: true });

    hook.run(() => icon.dispatchEvent(press));

    expect(press.defaultPrevented).toBe(true);

    hook.run(() => window.dispatchEvent(new MouseEvent('mousemove', { clientX: 1620, clientY: 140 })));

    expect(hook.current().labels[0]?.dragging).toBe(true);

    hook.run(() => window.dispatchEvent(new MouseEvent('mouseup', { clientX: 1620, clientY: 140 })));

    expect(sent(mock)[1]).toEqual({ type: 'moved', id: 'otmetki.hud.damage_log', x: -300, y: 140, align_x: 'right', align_y: 'top' });
    expect(hook.current().labels[0]?.dragging).toBe(false);
    icon.remove();
  });

  it('keeps the moved place when the next state still carries the old one until the game saves it', async () => {
    const { hook } = await mount(sample);

    hook.run(() => window.dispatchEvent(new MouseEvent('mousedown', { clientX: 20, clientY: 940, button: 0 })));
    hook.run(() => window.dispatchEvent(new MouseEvent('mousemove', { clientX: 120, clientY: 900 })));
    hook.run(() => window.dispatchEvent(new MouseEvent('mouseup', { clientX: 120, clientY: 900 })));

    expect(hook.current().labels[0]?.style).toMatchObject({ left: '120rem', top: '900rem' });
  });

  it('starts no drag when the press misses every panel', async () => {
    const { mock, hook } = await mount(sample);

    hook.run(() => window.dispatchEvent(new MouseEvent('mousedown', { clientX: 900, clientY: 300, button: 0 })));
    hook.run(() => window.dispatchEvent(new MouseEvent('mouseup', { clientX: 1000, clientY: 400 })));

    expect(sent(mock)).toHaveLength(1);
  });

  it('scales a panel with the wheel while the modifier is held', async () => {
    const { mock, hook } = await mount(sample);
    const wheel = new WheelEvent('wheel', { clientX: 20, clientY: 940, deltaY: -100, cancelable: true });

    hook.run(() => window.dispatchEvent(wheel));

    expect(wheel.defaultPrevented).toBe(true);
    expect(sent(mock)[1]).toEqual({ type: 'resized', id: 'otmetki.hud.damage_log', scale: 1.1 });
    expect(hook.current().labels[0]?.style).toMatchObject({ transform: 'scale(1.1)', transformOrigin: '0 0' });
  });

  it('presses the settings button without the modifier and never drags it then', async () => {
    const { mock, hook } = await mount(withState({ edit: false }, { kind: 'button' }));
    const [button] = hook.current().labels;

    expect(button).toMatchObject({ button: true, interactive: true, framed: false });

    hook.run(() => button?.onClick());

    expect(sent(mock)[1]).toEqual({ type: 'pressed', id: 'otmetki.hud.damage_log' });
  });

  it('limits the mouse to the clickable panels, and to the whole screen only in edit mode', async () => {
    const { mock } = await mount(withState({ edit: false }));

    expect(mock.inputAreas().at(-1)).toEqual([0, 0, 0, 0]);

    const edited = await mount(sample);

    expect(edited.mock.inputAreas().at(-1)).toEqual([0, 0, 1920, 1080]);
  });

  it('draws a known widget instead of the text and falls back to the text for an unknown one', async () => {
    const widget = { kind: 'battle_clock', v: 1, data: { time: '21:47', date: '', timer: '', big_timer: false, icon: 'otmetki:clock' } };
    const { hook } = await mount(withState({}, { widget }));

    expect(hook.current().labels[0]?.widget?.kind).toBe('battle_clock');

    const unknown = await mount(withState({}, { widget: { kind: 'nope', v: 1, data: {} } }));

    expect(unknown.hook.current().labels[0]?.widget).toBeNull();
  });

  it('ignores a state that does not parse', async () => {
    const { hook } = await mount('{"v": 99}');

    expect(hook.current().labels).toEqual([]);
  });
});
