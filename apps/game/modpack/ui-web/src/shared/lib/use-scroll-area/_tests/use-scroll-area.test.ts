// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';

import { SCROLL_AREA } from '../../../config';
import { renderHook } from '../../testing/render-hook';
import { useScrollArea } from '../use-scroll-area';

const viewport = ({ content, height }: { content: number; height: number }): HTMLDivElement => {
  const element = document.createElement('div');

  Object.defineProperty(element, 'scrollHeight', { value: content });
  Object.defineProperty(element, 'clientHeight', { value: height });

  return element;
};

afterEach(() => {
  vi.useRealTimers();
});

describe(useScrollArea, () => {
  it('marks its viewport for the page wheel handler', () => {
    expect(renderHook(useScrollArea).current().viewportProps).toEqual({ [SCROLL_AREA.attribute]: '' });
  });

  it('shows a thumb sized by the visible share once the content is measured', () => {
    vi.useFakeTimers();

    const hook = renderHook(useScrollArea);

    hook.current().viewportRef.current = viewport({ content: 1000, height: 500 });
    hook.run(() => vi.advanceTimersByTime(SCROLL_AREA.measureMs));

    expect(hook.current().thumb).toEqual({ visible: true, size: 250, offset: 0 });
    hook.unmount();
  });

  it('hides the thumb when everything fits', () => {
    vi.useFakeTimers();

    const hook = renderHook(useScrollArea);

    hook.current().viewportRef.current = viewport({ content: 300, height: 500 });
    hook.run(() => vi.advanceTimersByTime(SCROLL_AREA.measureMs));

    expect(hook.current().thumb.visible).toBe(false);
    hook.unmount();
  });
});
