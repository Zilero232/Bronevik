// @vitest-environment jsdom
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';

import { GAMEFACE } from '../../../../../../shared/api/gameface';
import { createGamefaceMock, installGamefaceMock } from '../../../../../../shared/api/gameface/mock';
import { renderHook } from '../../../../../../shared/lib/testing/render-hook';
import { useHudOverlay } from '../use-hud-overlay';

const sample = readFileSync(
  path.resolve(import.meta.dirname, '../../../../../../shared/api/hud-protocol/_tests/fixtures/hud-state.sample.json'),
  'utf8'
);

const install = (state: string) => {
  const mock = createGamefaceMock({ state, clientSize: () => ({ width: 1920, height: 1080 }), onSend: () => null });

  installGamefaceMock(mock);

  return mock;
};

const target = (box: Pick<DOMRect, 'height' | 'left' | 'top' | 'width'>): Element => {
  const element = document.createElement('div');

  element.getBoundingClientRect = () => ({
    ...box,
    x: box.left,
    y: box.top,
    right: box.left + box.width,
    bottom: box.top + box.height,
    toJSON: () => box
  });

  return element;
};

afterEach(() => {
  Object.values(GAMEFACE.globals).forEach((name) => Reflect.deleteProperty(globalThis, name));
});

describe(useHudOverlay, () => {
  it('announces itself and draws the pushed labels from their anchors', async () => {
    const mock = install(sample);
    const hook = renderHook(useHudOverlay);

    await hook.settle();
    await hook.settle();

    expect(mock.sent().map((message) => JSON.parse(message))).toEqual([{ type: 'ready' }]);

    const [label] = hook.current().labels;

    expect(label?.style).toEqual({ left: '20rem', bottom: '140rem', opacity: 0.9 });
    expect(label?.lines[0]?.[0]).toMatchObject({ kind: 'text', style: { color: '#F2EAD3' } });
    expect(label?.draggable).toBe(true);
  });

  it('drags a label while the cursor is shown and reports its new anchor', async () => {
    const mock = install(sample);
    const hook = renderHook(useHudOverlay);

    await hook.settle();
    await hook.settle();

    document.documentElement.style.fontSize = '1px';
    window.innerWidth = 1920;
    window.innerHeight = 1080;

    hook.run(() =>
      hook.current().labels[0]?.onMouseDown({ clientX: 100, clientY: 900, currentTarget: target({ left: 20, top: 880, width: 200, height: 60 }) })
    );

    hook.run(() => window.dispatchEvent(new MouseEvent('mousemove', { clientX: 1700, clientY: 100 })));

    expect(hook.current().labels[0]?.dragging).toBe(true);

    hook.run(() => window.dispatchEvent(new MouseEvent('mouseup', { clientX: 1700, clientY: 100 })));

    const moved = mock.sent().map((message) => JSON.parse(message) as Record<string, unknown>)[1];

    expect(moved).toEqual({ type: 'moved', id: 'otmetki.hud.damage_log', x: -100, y: 80, align_x: 'right', align_y: 'top' });
    expect(hook.current().labels[0]?.style).toMatchObject({ right: '100rem', top: '80rem' });
    expect(hook.current().labels[0]?.dragging).toBe(false);
  });

  it('ignores a press without the cursor and a state that does not parse', async () => {
    const mock = install(JSON.stringify({ ...JSON.parse(sample), cursor: false }));
    const hook = renderHook(useHudOverlay);

    await hook.settle();
    await hook.settle();

    hook.run(() =>
      hook.current().labels[0]?.onMouseDown({ clientX: 1, clientY: 1, currentTarget: target({ left: 0, top: 0, width: 1, height: 1 }) })
    );

    hook.run(() => window.dispatchEvent(new MouseEvent('mouseup', { clientX: 50, clientY: 50 })));

    expect(mock.sent()).toHaveLength(1);
    expect(hook.current().labels[0]?.draggable).toBe(false);

    install('{"v": 99}');

    const empty = renderHook(useHudOverlay);

    await empty.settle();

    expect(empty.current().labels).toEqual([]);
  });
});
