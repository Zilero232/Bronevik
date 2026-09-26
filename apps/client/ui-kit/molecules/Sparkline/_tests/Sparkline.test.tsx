import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Sparkline } from '../Sparkline';

const pathOf = (container: HTMLElement) => container.querySelector('path')?.getAttribute('d') ?? '';

const heightsOf = (d: string) => (d.match(/-?\d+(?:\.\d+)?/g) ?? []).map(Number).filter((_, index) => index % 2 === 1);

describe('Sparkline', () => {
  it('draws a finite flat line for an empty series', () => {
    const { container } = render(<Sparkline data={[]} />);
    const d = pathOf(container);

    expect(d).not.toBe('');
    expect(d).not.toContain('NaN');
    expect(new Set(heightsOf(d)).size).toBe(1);
  });

  it('draws a finite flat line for a single point', () => {
    const { container } = render(<Sparkline data={[42]} />);
    const d = pathOf(container);

    expect(d).not.toContain('NaN');
    expect(new Set(heightsOf(d)).size).toBe(1);
  });

  it('draws a finite line for a constant series', () => {
    const { container } = render(<Sparkline data={[5, 5, 5]} />);

    expect(pathOf(container)).not.toContain('NaN');
  });

  it('puts a rising series higher at its end than at its start', () => {
    const { container } = render(<Sparkline data={[1, 2, 3]} />);
    const heights = heightsOf(pathOf(container));

    expect(heights.at(-1)).toBeLessThan(heights[0] ?? 0);
  });

  it('adds an area under the line on request', () => {
    const { container } = render(<Sparkline withArea data={[1, 3, 2]} />);

    expect(container.querySelectorAll('path')).toHaveLength(2);
  });

  it('is an image named by its label', () => {
    render(<Sparkline data={[1, 2]} label='WN8 trend' />);

    expect(screen.getByRole('img', { name: 'WN8 trend' })).toBeInTheDocument();
  });

  it('stays out of the accessibility tree without a label', () => {
    render(<Sparkline data={[1, 2]} />);

    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });
});
