// @vitest-environment jsdom
import { act } from 'preact/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { SCROLL_AREA } from '../../../config';
import { mount } from '../../../lib/testing/mount';
import { ScrollArea } from '../ScrollArea';

const viewportOf = (container: HTMLElement): HTMLElement => {
  const viewport = container.querySelector<HTMLElement>('[role="region"]');

  if (!viewport) {
    throw new Error('the scroll area has no viewport');
  }

  return viewport;
};

afterEach(() => {
  vi.useRealTimers();
});

describe(ScrollArea, () => {
  it('opens at the position the page was left at', () => {
    const container = mount({ Component: ScrollArea, props: { label: 'Hangar', initialTop: 120, children: 'cards' } });

    const viewport = viewportOf(container);

    expect(viewport.scrollTop).toBe(120);
  });

  it('reports the position once the scrolling settles', () => {
    vi.useFakeTimers();

    const settled: number[] = [];
    const container = mount({
      Component: ScrollArea,
      props: { label: 'Hangar', onScrollEnd: (top: number) => settled.push(top), children: 'cards' }
    });

    const viewport = viewportOf(container);

    act(() => {
      viewport.scrollTop = 300;
      viewport.dispatchEvent(new Event('scroll'));
      vi.advanceTimersByTime(SCROLL_AREA.settleMs);
    });

    expect(settled).toEqual([300]);
  });
});
