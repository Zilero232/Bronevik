// @vitest-environment jsdom
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { GAMEFACE } from '../../../../../../shared/api/gameface';
import { createGamefaceMock, installGamefaceMock } from '../../../../../../shared/api/gameface/mock';
import { renderHook } from '../../../../../../shared/lib/testing/render-hook';
import { useHudOverlay } from '../use-hud-overlay';

const sample = readFileSync(
  path.resolve(import.meta.dirname, '../../../../../../shared/api/hud-protocol/_tests/fixtures/hud-state.sample.json'),
  'utf8'
);

const withState = (patch: Record<string, unknown>, panel: Record<string, unknown> = {}): string => {
  const state = JSON.parse(sample) as { panels: Record<string, unknown>[] };

  return JSON.stringify({ ...state, ...patch, panels: state.panels.map((item) => ({ ...item, ...panel })) });
};

const install = (state: string) => {
  const mock = createGamefaceMock({ state, clientSize: () => ({ width: 1920, height: 1080 }), onSend: () => null });

  installGamefaceMock(mock);

  return mock;
};

const sent = (mock: ReturnType<typeof install>) => mock.sent().map((message) => JSON.parse(message) as Record<string, unknown>);

const mount = async (state: string) => {
  const mock = install(state);
  const hook = renderHook(useHudOverlay);

  await hook.settle();
  await hook.settle();

  return { mock, hook };
};

afterEach(() => {
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
    expect(label?.lines[0]?.[0]).toMatchObject({ kind: 'text', style: { color: '#F2EAD3' } });
    expect(hook.current().style).toEqual({ width: '1920rem', height: '1080rem' });
  });

  it('lets the mouse through and shows no frame until the edit modifier is held', async () => {
    const { mock, hook } = await mount(withState({ edit: false }));
    const [label] = hook.current().labels;

    expect(label).toMatchObject({ interactive: false, framed: false });

    hook.run(() => label?.onMouseDown({ clientX: 1, clientY: 1 }));
    hook.run(() => window.dispatchEvent(new MouseEvent('mouseup', { clientX: 50, clientY: 50 })));
    hook.run(() => label?.onWheel({ deltaY: -1, preventDefault: () => undefined }));

    expect(sent(mock)).toHaveLength(1);
  });

  it('drags a label while the modifier is held and reports its new anchor', async () => {
    const { mock, hook } = await mount(sample);

    expect(hook.current().labels[0]).toMatchObject({ interactive: true, framed: true });

    hook.run(() => hook.current().labels[0]?.onMouseDown({ clientX: 100, clientY: 900 }));
    hook.run(() => window.dispatchEvent(new MouseEvent('mousemove', { clientX: 1700, clientY: 100 })));

    expect(hook.current().labels[0]?.dragging).toBe(true);

    hook.run(() => window.dispatchEvent(new MouseEvent('mouseup', { clientX: 1700, clientY: 100 })));

    expect(sent(mock)[1]).toEqual({ type: 'moved', id: 'otmetki.hud.damage_log', x: -300, y: 140, align_x: 'right', align_y: 'top' });
    expect(hook.current().labels[0]?.dragging).toBe(false);
  });

  it('scales a panel with the wheel while the modifier is held', async () => {
    const { mock, hook } = await mount(sample);
    const preventDefault = vi.fn();

    hook.run(() => hook.current().labels[0]?.onWheel({ deltaY: -100, preventDefault }));

    expect(preventDefault).toHaveBeenCalledOnce();
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

  it('ignores a state that does not parse', async () => {
    const { hook } = await mount('{"v": 99}');

    expect(hook.current().labels).toEqual([]);
  });
});
