import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useSectionReveal } from '..';

type ObserverCallback = (entries: Array<{ isIntersecting: boolean }>) => void;

const observers: Array<{ callback: ObserverCallback; disconnect: ReturnType<typeof vi.fn> }> = [];

class ObserverProbe {
  readonly root = null;
  readonly rootMargin = '';
  readonly thresholds = [];
  readonly disconnect = vi.fn();
  constructor(callback: ObserverCallback) {
    observers.push({ callback, disconnect: this.disconnect });
  }
  observe() {}
  unobserve() {}
  takeRecords() {
    return [];
  }
}

const originalObserver = globalThis.IntersectionObserver;

const Section = () => {
  const ref = useSectionReveal<HTMLElement>();

  return <section ref={ref} data-testid='section' />;
};

const placeSection = (top: number) => {
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue(DOMRect.fromRect({ x: 0, y: top, width: 100, height: 100 }));
};

const setReducedMotion = (matches: boolean) => {
  vi.spyOn(window, 'matchMedia').mockImplementation((query) => ({
    matches,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn()
  }));
};

const reveal = (isIntersecting: boolean) => {
  act(() => {
    observers.at(-1)?.callback([{ isIntersecting }]);
  });
};

beforeEach(() => {
  setReducedMotion(false);
  vi.stubGlobal('IntersectionObserver', ObserverProbe);
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.stubGlobal('IntersectionObserver', originalObserver);
  observers.length = 0;
});

describe('useSectionReveal', () => {
  it('leaves a section already on screen untouched', () => {
    placeSection(0);
    render(<Section />);

    expect(screen.getByTestId('section')).not.toHaveAttribute('data-reveal');
    expect(observers).toHaveLength(0);
  });

  it('holds a below-the-fold section until it scrolls into view', () => {
    placeSection(window.innerHeight * 2);
    render(<Section />);

    expect(screen.getByTestId('section')).toHaveAttribute('data-reveal', 'pending');
  });

  it('shows the section once it intersects and stops observing', () => {
    placeSection(window.innerHeight * 2);
    render(<Section />);

    reveal(true);

    expect(screen.getByTestId('section')).toHaveAttribute('data-reveal', 'shown');
    expect(observers.at(-1)?.disconnect).toHaveBeenCalled();
  });

  it('keeps waiting while the section is still outside the viewport', () => {
    placeSection(window.innerHeight * 2);
    render(<Section />);

    reveal(false);

    expect(screen.getByTestId('section')).toHaveAttribute('data-reveal', 'pending');
  });

  it('never hides content for users who prefer reduced motion', () => {
    setReducedMotion(true);
    placeSection(window.innerHeight * 2);
    render(<Section />);

    expect(screen.getByTestId('section')).not.toHaveAttribute('data-reveal');
  });

  it('removes the pending marker on unmount', () => {
    placeSection(window.innerHeight * 2);
    const { unmount } = render(<Section />);
    const section = screen.getByTestId('section');

    unmount();

    expect(section).not.toHaveAttribute('data-reveal');
  });
});
