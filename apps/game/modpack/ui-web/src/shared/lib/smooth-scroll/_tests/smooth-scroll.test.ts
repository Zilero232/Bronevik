// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { createSmoothScroll } from '../smooth-scroll';
import { SMOOTH_SCROLL } from '../smooth-scroll.constants';

const FRAME_MS = 16;

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['requestAnimationFrame'] });
});

afterEach(() => {
  vi.useRealTimers();
});

describe(createSmoothScroll, () => {
  it('reaches the target once the glide is over', () => {
    const element = { scrollTop: 0 };
    const glide = createSmoothScroll({ element });

    glide.scrollTo(300);
    vi.advanceTimersByTime(SMOOTH_SCROLL.durationMs + FRAME_MS * 2);

    expect(element.scrollTop).toBe(300);
  });

  it('eases out: most of the way is covered in the first half of the glide', () => {
    const element = { scrollTop: 0 };
    const glide = createSmoothScroll({ element });

    glide.scrollTo(300);
    vi.advanceTimersByTime(SMOOTH_SCROLL.durationMs / 2 + FRAME_MS);

    expect(element.scrollTop).toBeGreaterThan(200);
  });

  it('writes whole pixels only', () => {
    const tops: number[] = [];
    const element = { scrollTop: 0 };
    const glide = createSmoothScroll({ element, onFrame: () => tops.push(element.scrollTop) });

    glide.scrollTo(97);
    vi.advanceTimersByTime(SMOOTH_SCROLL.durationMs + FRAME_MS * 2);

    expect(tops.filter((top) => !Number.isInteger(top))).toEqual([]);
  });

  it('adds a second notch to the target of the running glide', () => {
    const element = { scrollTop: 0 };
    const glide = createSmoothScroll({ element });

    glide.scrollTo(100);
    vi.advanceTimersByTime(FRAME_MS * 2);

    glide.scrollTo(glide.target() + 100);
    vi.advanceTimersByTime(SMOOTH_SCROLL.durationMs + FRAME_MS * 2);

    expect(element.scrollTop).toBe(200);
  });

  it('does not move for a target it is already at', () => {
    const element = { scrollTop: 40 };
    const glide = createSmoothScroll({ element });

    const moved = glide.scrollTo(40);

    expect(moved).toBe(false);
  });

  it('gives way when something else moves the box during the glide', () => {
    const element = { scrollTop: 0 };
    const glide = createSmoothScroll({ element });

    glide.scrollTo(300);
    vi.advanceTimersByTime(FRAME_MS * 2);

    element.scrollTop = 20;
    vi.advanceTimersByTime(SMOOTH_SCROLL.durationMs + FRAME_MS * 2);

    expect(element.scrollTop).toBe(20);
  });
});
