// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';

import { SCROLL_AREA } from '../../../config';
import { renderHook } from '../../testing/render-hook';
import { useScrollArea } from '../use-scroll-area';

const unmounts: (() => void)[] = [];

const viewport = ({ content, height }: { content: number; height: number }): HTMLDivElement => {
  const element = document.createElement('div');

  Object.defineProperty(element, 'scrollHeight', { value: content });
  Object.defineProperty(element, 'clientHeight', { value: height });

  return element;
};

const measure = ({ content, height }: { content: number; height: number }) => {
  vi.useFakeTimers();

  const hook = renderHook(useScrollArea);

  unmounts.push(hook.unmount);
  hook.current().viewportRef.current = viewport({ content, height });
  hook.run(() => vi.advanceTimersByTime(SCROLL_AREA.measureMs));

  return hook.current().thumb;
};

afterEach(() => {
  unmounts.splice(0).forEach((unmount) => unmount());
  vi.useRealTimers();
});

describe(useScrollArea, () => {
  it('shows a thumb sized by the visible share once the content is measured', () => {
    const thumb = measure({ content: 1000, height: 500 });

    expect(thumb).toEqual({ visible: true, size: 250, offset: 0 });
  });

  it('hides the thumb when everything fits', () => {
    const thumb = measure({ content: 300, height: 500 });

    expect(thumb.visible).toBe(false);
  });
});
