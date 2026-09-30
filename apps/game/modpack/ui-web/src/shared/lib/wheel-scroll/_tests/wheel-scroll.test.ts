// @vitest-environment jsdom
import { describe, expect, it, vi } from 'vitest';

import { SCROLL_AREA } from '../../../config';
import { bindWheelScroll, scrollByWheel, thumbOf, topFromThumb, wheelScroll, wheelTarget } from '../wheel-scroll';

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

const box = ({ content, height, top = 0, marked = false }: { content: number; height: number; top?: number; marked?: boolean }): HTMLDivElement => {
  const element = document.createElement('div');

  Object.defineProperty(element, 'scrollHeight', { value: content });
  Object.defineProperty(element, 'clientHeight', { value: height });
  element.scrollTop = top;

  if (marked) {
    element.setAttribute(SCROLL_AREA.attribute, '');
  }

  return element;
};

describe(wheelTarget, () => {
  it('finds the nearest box that scrolls, a native overflow box or a marked scroll area', () => {
    const outer = box({ content: 2000, height: 500, marked: true });
    const inner = box({ content: 900, height: 300 });
    const leaf = document.createElement('span');

    inner.style.overflowY = 'auto';
    inner.append(leaf);
    outer.append(inner);

    expect(wheelTarget({ start: leaf, deltaY: 100 })).toBe(inner);
  });

  it('hands the wheel to the outer box once the inner one is at its end', () => {
    const outer = box({ content: 2000, height: 500, marked: true });
    const inner = box({ content: 900, height: 300, top: 600 });
    const leaf = document.createElement('span');

    inner.style.overflowY = 'auto';
    inner.append(leaf);
    outer.append(inner);

    expect(wheelTarget({ start: leaf, deltaY: 100 })).toBe(outer);
    expect(wheelTarget({ start: leaf, deltaY: -100 })).toBe(inner);
  });
});

describe(bindWheelScroll, () => {
  it('scrolls the box under the pointer down on a wheel-down notch and never lets the engine scroll natively', () => {
    const area = box({ content: 2000, height: 500, marked: true });
    const row = document.createElement('div');

    area.append(row);
    document.body.append(area);

    const unbind = bindWheelScroll(document);
    const down = new WheelEvent('wheel', { deltaY: 100, bubbles: true, cancelable: true });

    row.dispatchEvent(down);

    expect(area.scrollTop).toBe(SCROLL_AREA.step);
    expect(down.defaultPrevented).toBe(true);

    const outside = new WheelEvent('wheel', { deltaY: 100, bubbles: true, cancelable: true });

    document.body.dispatchEvent(outside);

    expect(outside.defaultPrevented).toBe(true);

    unbind();
    area.remove();
  });
});
