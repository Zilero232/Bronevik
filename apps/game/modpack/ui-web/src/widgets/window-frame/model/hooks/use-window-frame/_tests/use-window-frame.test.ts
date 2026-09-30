// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest';

import { GAMEFACE } from '../../../../../../shared/api/gameface';
import { createGamefaceMock, installGamefaceMock } from '../../../../../../shared/api/gameface/mock';
import { isRecord } from '../../../../../../shared/lib/is-record';
import { forgetReports } from '../../../../../../shared/lib/page-diag';
import { renderHook } from '../../../../../../shared/lib/testing/render-hook';
import { useWindowFrame } from '../use-window-frame';

const SCREEN_REM = { width: 1663, height: 962 };
const SCALE = 2;
const SAVED = { placed: true, x: 274, y: 135, width: 1240, height: 800, zoom: 100 };

const install = (view: { x: number; y: number }) => {
  const mock = createGamefaceMock({
    state: '',
    clientSize: () => ({ width: SCREEN_REM.width * SCALE, height: SCREEN_REM.height * SCALE }),
    onSend: () => null
  });

  const viewEnv = mock.scope[GAMEFACE.globals.viewEnv];

  if (!isRecord(viewEnv)) {
    throw new Error('the Gameface mock has no viewEnv');
  }

  Object.assign(viewEnv, {
    [GAMEFACE.viewEnv.clientSizeRem]: () => SCREEN_REM,
    [GAMEFACE.viewEnv.viewPosition]: () => view,
    [GAMEFACE.viewEnv.viewSize]: () => SCREEN_REM,
    [GAMEFACE.viewEnv.remToPx]: (value: number) => value * SCALE
  });

  installGamefaceMock(mock);

  return mock;
};

const handleAt = (rect: { left: number; top: number; width: number; height: number }): HTMLDivElement => {
  const element = document.createElement('div');

  element.getBoundingClientRect = () => DOMRect.fromRect({ x: rect.left, y: rect.top, width: rect.width, height: rect.height });

  return element;
};

const mouse = (type: string, clientX: number, clientY: number) => new MouseEvent(type, { clientX, clientY, bubbles: true, cancelable: true });

const layouts = (sent: string[]) => sent.map((raw): { type: string } => JSON.parse(raw)).filter((message) => message.type === 'window_layout');

afterEach(() => {
  forgetReports();
  Object.values(GAMEFACE.globals).forEach((name) => Reflect.deleteProperty(globalThis, name));
});

describe(useWindowFrame, () => {
  it('opens centred on the screen at the saved size, whatever position was saved', () => {
    install({ x: 0, y: 0 });

    const hook = renderHook(() => useWindowFrame(SAVED));

    expect(hook.current().frameStyle).toEqual({ left: '212rem', top: '81rem', width: '1240rem', height: '800rem' });
    hook.unmount();
  });

  it('places the box on the screen, not in a view the client put off the screen origin', () => {
    install({ x: 211.5, y: 81 });

    const hook = renderHook(() => useWindowFrame(SAVED));

    expect(hook.current().frameStyle).toEqual({ left: '106rem', top: '41rem', width: '1240rem', height: '800rem' });
    hook.unmount();
  });

  it('moves by the title on the presses Gameface sends to the document, in rem at the interface scale', () => {
    const mock = install({ x: 0, y: 0 });
    const hook = renderHook(() => useWindowFrame(SAVED));

    hook.current().handles.move.current = handleAt({ left: 424, top: 162, width: 400, height: 120 });

    hook.run(() => {
      document.body.dispatchEvent(mouse('mousedown', 500, 200));
      document.body.dispatchEvent(mouse('mousemove', 400, 150));
      document.body.dispatchEvent(mouse('mouseup', 400, 150));
    });

    expect(hook.current().frameStyle).toMatchObject({ left: '162rem', top: '56rem' });
    expect(layouts(mock.sent())).toEqual([expect.objectContaining({ x: 162, y: 56, placed: true })]);
    hook.unmount();
  });

  it('resizes by the grip and ignores presses on the content', () => {
    install({ x: 0, y: 0 });

    const hook = renderHook(() => useWindowFrame(SAVED));

    hook.current().handles.corner.current = handleAt({ left: 2880, top: 1740, width: 36, height: 36 });

    hook.run(() => {
      document.body.dispatchEvent(mouse('mousedown', 1000, 800));
      document.body.dispatchEvent(mouse('mousemove', 900, 700));
      document.body.dispatchEvent(mouse('mouseup', 900, 700));
    });

    expect(hook.current().frameStyle).toMatchObject({ width: '1240rem', height: '800rem' });

    hook.run(() => {
      document.body.dispatchEvent(mouse('mousedown', 2890, 1750));
      document.body.dispatchEvent(mouse('mousemove', 2790, 1650));
      document.body.dispatchEvent(mouse('mouseup', 2790, 1650));
    });

    expect(hook.current().frameStyle).toMatchObject({ width: '1190rem', height: '750rem' });
    hook.unmount();
  });
});
