import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import type { UseChartHoverInput } from '..';

import { useChartHover } from '..';
import { CHART } from '../../chart-scale';

const STEP = 10;
const POINTS = 5;
const ROW_TOP = 30;

const toIndex = (x: number) => Math.min(POINTS - 1, Math.max(0, Math.round(x / STEP)));
const toPosition = (index: number) => ({ left: index * STEP, top: ROW_TOP });

const Plot = ({ count }: Pick<UseChartHoverInput, 'count'>) => {
  const { hover, onPointerMove, onPointerLeave } = useChartHover({ count, toIndex, toPosition });

  return (
    <>
      <svg>
        <rect data-testid='overlay' onPointerLeave={onPointerLeave} onPointerMove={onPointerMove} />
      </svg>
      <output data-testid='hover'>{hover ? JSON.stringify(hover) : 'none'}</output>
    </>
  );
};

const hoverState = () => {
  const text = screen.getByTestId('hover').textContent;

  return text === 'none' ? null : JSON.parse(text ?? 'null');
};

describe('useChartHover', () => {
  it('has no hover before the pointer enters', () => {
    render(<Plot count={POINTS} />);

    expect(hoverState()).toBeNull();
  });

  it('snaps to the nearest point and offsets it by the plot margin', () => {
    render(<Plot count={POINTS} />);

    fireEvent.pointerMove(screen.getByTestId('overlay'), { clientX: CHART.margin.left + STEP * 2 + 1, clientY: 0 });

    expect(hoverState()).toEqual({ index: 2, left: 2 * STEP + CHART.margin.left, top: ROW_TOP + CHART.margin.top });
  });

  it('clears the hover when the pointer leaves', () => {
    render(<Plot count={POINTS} />);
    const overlay = screen.getByTestId('overlay');

    fireEvent.pointerMove(overlay, { clientX: CHART.margin.left, clientY: 0 });
    fireEvent.pointerLeave(overlay);

    expect(hoverState()).toBeNull();
  });

  it('keeps the readout after a tap, where leave fires right away', () => {
    render(<Plot count={POINTS} />);
    const overlay = screen.getByTestId('overlay');

    fireEvent.pointerMove(overlay, { clientX: CHART.margin.left, clientY: 0 });
    fireEvent.pointerLeave(overlay, { pointerType: 'touch' });

    expect(hoverState()).not.toBeNull();
  });

  it('ignores the pointer on an empty series', () => {
    render(<Plot count={0} />);

    fireEvent.pointerMove(screen.getByTestId('overlay'), { clientX: CHART.margin.left, clientY: 0 });

    expect(hoverState()).toBeNull();
  });
});
