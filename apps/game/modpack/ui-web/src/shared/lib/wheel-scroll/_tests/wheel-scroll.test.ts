// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';

import { GAMEFACE } from '../../../api/gameface';
import { createGamefaceMock, installGamefaceMock } from '../../../api/gameface/mock';
import { SCROLL_AREA } from '../../../config';
import { isRecord } from '../../is-record';
import { forgetReports } from '../../page-diag';
import { bindWheelScroll, blockPageWheel, scrollByWheel, thumbOf, topFromThumb, wheelDelta, wheelScroll } from '../wheel-scroll';

afterEach(() => {
  forgetReports();
});

describe(wheelScroll, () => {
  it('scrolls down on a positive delta and up on a negative one, as the client scroll areas read it', () => {
    expect(wheelScroll({ top: 100, deltaY: 120, max: 1000, step: 60 })).toBe(160);
    expect(wheelScroll({ top: 100, deltaY: -3, max: 1000, step: 60 })).toBe(40);
  });

  it('moves one step per notch whatever the delta size', () => {
    expect(wheelScroll({ top: 0, deltaY: 1, max: 1000, step: 60 })).toBe(60);
    expect(wheelScroll({ top: 0, deltaY: 900, max: 1000, step: 60 })).toBe(60);
  });

  it('stays inside the content', () => {
    expect(wheelScroll({ top: 980, deltaY: 100, max: 1000, step: 60 })).toBe(1000);
    expect(wheelScroll({ top: 20, deltaY: -100, max: 1000, step: 60 })).toBe(0);
    expect(wheelScroll({ top: 0, deltaY: 100, max: -50, step: 60 })).toBe(0);
    expect(wheelScroll({ top: 40, deltaY: 0, max: 1000, step: 60 })).toBe(40);
  });
});

describe(wheelDelta, () => {
  it('reads deltaY, or the legacy wheelDelta an engine without deltaY sends, down as positive', () => {
    expect(wheelDelta({ deltaY: 100 })).toBe(100);
    expect(wheelDelta({ deltaY: 0, wheelDeltaY: -120 })).toBe(120);
    expect(wheelDelta({ deltaY: Number.NaN, wheelDelta: 120 })).toBe(-120);
    expect(wheelDelta({ deltaY: 0 })).toBe(0);
  });
});

describe(thumbOf, () => {
  it('hides the bar when everything fits', () => {
    expect(thumbOf({ top: 0, content: 300, viewport: 400, minThumb: 24 }).visible).toBe(false);
  });

  it('sizes the thumb by the visible share and moves it along the track', () => {
    expect(thumbOf({ top: 0, content: 800, viewport: 400, minThumb: 24 })).toEqual({ visible: true, size: 200, offset: 0 });
    expect(thumbOf({ top: 400, content: 800, viewport: 400, minThumb: 24 })).toEqual({ visible: true, size: 200, offset: 200 });
    expect(thumbOf({ top: 0, content: 40_000, viewport: 400, minThumb: 24 }).size).toBe(24);
  });
});

describe(topFromThumb, () => {
  it('turns a dragged thumb back into a scroll position', () => {
    expect(topFromThumb({ offset: 100, size: 200, content: 800, viewport: 400, top: 0 })).toBe(200);
    expect(topFromThumb({ offset: 900, size: 200, content: 800, viewport: 400, top: 0 })).toBe(400);
    expect(topFromThumb({ offset: 50, size: 400, content: 400, viewport: 400, top: 0 })).toBe(0);
  });
});

describe(scrollByWheel, () => {
  const wheel = (deltaY: number) => ({ deltaY, preventDefault: vi.fn(), stopPropagation: vi.fn() });

  it('scrolls a native scroll box itself, down for a wheel-down notch, and keeps the event from the engine', () => {
    const element = { scrollTop: 0, scrollHeight: 1000, clientHeight: 400 };
    const down = wheel(120);

    expect(scrollByWheel({ element, event: down })).toBe(true);
    expect(element.scrollTop).toBe(SCROLL_AREA.step);
    expect(down.preventDefault).toHaveBeenCalled();
    expect(down.stopPropagation).toHaveBeenCalled();
  });

  it('passes the wheel on at the end of the content', () => {
    const element = { scrollTop: 600, scrollHeight: 1000, clientHeight: 400 };
    const down = wheel(120);

    expect(scrollByWheel({ element, event: down })).toBe(false);
    expect(element.scrollTop).toBe(600);
    expect(down.stopPropagation).not.toHaveBeenCalled();
  });
});

const box = ({ content, height, top = 0 }: { content: number; height: number; top?: number }): HTMLDivElement => {
  const element = document.createElement('div');

  Object.defineProperty(element, 'scrollHeight', { value: content });
  Object.defineProperty(element, 'clientHeight', { value: height });
  Object.defineProperty(element, 'hasAttribute', { value: undefined });
  element.scrollTop = top;

  return element;
};

const install = (scale: number) => {
  const mock = createGamefaceMock({ state: '', clientSize: () => ({ width: 1920, height: 1080 }), onSend: () => null });

  const viewEnv = mock.scope[GAMEFACE.globals.viewEnv];

  if (!isRecord(viewEnv)) {
    throw new Error('the Gameface mock has no viewEnv');
  }

  viewEnv[GAMEFACE.viewEnv.remToPx] = (value: number) => value * scale;
  installGamefaceMock(mock);

  return mock;
};

const notch = (deltaY: number) => new WheelEvent('wheel', { deltaY, bubbles: true, cancelable: true });

describe(bindWheelScroll, () => {
  it('scrolls its box on the wheel Gameface sends to a row inside it, by a step at the interface scale', () => {
    const mock = install(2);
    const area = box({ content: 2000, height: 500 });
    const row = document.createElement('div');
    const onScrolled = vi.fn();

    area.append(row);
    document.body.append(area);

    const unbind = bindWheelScroll({ element: area, onScrolled });
    const down = notch(100);

    row.dispatchEvent(down);

    expect(area.scrollTop).toBe(SCROLL_AREA.step * 2);
    expect(down.defaultPrevented).toBe(true);
    expect(onScrolled).toHaveBeenCalledTimes(1);

    expect(
      mock
        .sent()
        .map((raw): { type: string } => JSON.parse(raw))
        .map((message) => message.type)
    ).toEqual(['diag']);

    row.dispatchEvent(notch(-100));

    expect(area.scrollTop).toBe(0);

    unbind();
    row.dispatchEvent(notch(100));

    expect(area.scrollTop).toBe(0);
    area.remove();
  });

  it('keeps the wheel for the inner box and hands it to the outer one at the inner end', () => {
    install(1);

    const outer = box({ content: 2000, height: 500 });
    const inner = box({ content: 900, height: 300 });
    const leaf = document.createElement('span');

    inner.append(leaf);
    outer.append(inner);
    document.body.append(outer);

    const unbind = [bindWheelScroll({ element: outer }), bindWheelScroll({ element: inner })];

    leaf.dispatchEvent(notch(100));

    expect([inner.scrollTop, outer.scrollTop]).toEqual([SCROLL_AREA.step, 0]);

    inner.scrollTop = 600;
    leaf.dispatchEvent(notch(100));

    expect([inner.scrollTop, outer.scrollTop]).toEqual([600, SCROLL_AREA.step]);

    unbind.forEach((off) => off());
    outer.remove();
  });
});

describe(blockPageWheel, () => {
  it('never lets the engine scroll the page natively', () => {
    const unbind = blockPageWheel(document);
    const outside = notch(100);

    document.body.dispatchEvent(outside);

    expect(outside.defaultPrevented).toBe(true);
    unbind();
  });
});
