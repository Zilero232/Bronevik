import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { useScrollToEnd } from '..';

const CONTENT_WIDTH = 1200;

const Strip = ({ items }: { items: number }) => {
  const ref = useScrollToEnd<HTMLDivElement>(items);

  return (
    <div ref={ref} data-testid='strip'>
      {items}
    </div>
  );
};

const stubContentWidth = (node: HTMLElement, width: number) => {
  Object.defineProperty(node, 'scrollWidth', { value: width, configurable: true });
};

describe('useScrollToEnd', () => {
  it('scrolls to the far end on mount', () => {
    Object.defineProperty(HTMLElement.prototype, 'scrollWidth', { value: CONTENT_WIDTH, configurable: true });
    render(<Strip items={3} />);
    Reflect.deleteProperty(HTMLElement.prototype, 'scrollWidth');

    expect(screen.getByTestId('strip').scrollLeft).toBe(CONTENT_WIDTH);
  });

  it('follows the end again when the key changes', () => {
    const { rerender } = render(<Strip items={3} />);
    const strip = screen.getByTestId('strip');

    stubContentWidth(strip, CONTENT_WIDTH * 2);
    rerender(<Strip items={4} />);

    expect(strip.scrollLeft).toBe(CONTENT_WIDTH * 2);
  });

  it('keeps the user scroll position while the key is unchanged', () => {
    const { rerender } = render(<Strip items={3} />);
    const strip = screen.getByTestId('strip');

    strip.scrollLeft = 0;
    stubContentWidth(strip, CONTENT_WIDTH);
    rerender(<Strip items={3} />);

    expect(strip.scrollLeft).toBe(0);
  });
});
