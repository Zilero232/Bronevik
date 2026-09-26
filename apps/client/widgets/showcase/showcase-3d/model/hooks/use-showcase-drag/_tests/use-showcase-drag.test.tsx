import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { SHOWCASE_MOTION } from '../../../../config';
import { useShowcaseDrag } from '../use-showcase-drag';

const reading: { impulse: () => number } = { impulse: () => 0 };

const Stage = () => {
  const { drag, handlers } = useShowcaseDrag();

  reading.impulse = () => drag.current.impulse;

  return (
    <div data-testid='stage' {...handlers}>
      <button type='button'>Open tank</button>
    </div>
  );
};

const capture = vi.fn();

beforeEach(() => {
  Object.defineProperty(HTMLElement.prototype, 'setPointerCapture', { value: capture, configurable: true });
});

afterEach(() => {
  Reflect.deleteProperty(HTMLElement.prototype, 'setPointerCapture');
  capture.mockClear();
});

describe('useShowcaseDrag', () => {
  it('turns a horizontal drag into spin impulse in the drag direction', () => {
    render(<Stage />);
    const stage = screen.getByTestId('stage');

    fireEvent.pointerDown(stage, { clientX: 100, pointerId: 1 });
    fireEvent.pointerMove(stage, { clientX: 150 });

    expect(reading.impulse()).toBeCloseTo(50 * SHOWCASE_MOTION.dragFactor);
    expect(capture).toHaveBeenCalledWith(1);
  });

  it('accumulates impulse across moves from the last pointer position', () => {
    render(<Stage />);
    const stage = screen.getByTestId('stage');

    fireEvent.pointerDown(stage, { clientX: 100 });
    fireEvent.pointerMove(stage, { clientX: 130 });
    fireEvent.pointerMove(stage, { clientX: 110 });

    expect(reading.impulse()).toBeCloseTo(10 * SHOWCASE_MOTION.dragFactor);
  });

  it('ignores pointer movement without a press', () => {
    render(<Stage />);

    fireEvent.pointerMove(screen.getByTestId('stage'), { clientX: 400 });

    expect(reading.impulse()).toBe(0);
  });

  it('stops following the pointer after release or cancel', () => {
    render(<Stage />);
    const stage = screen.getByTestId('stage');

    fireEvent.pointerDown(stage, { clientX: 100 });
    fireEvent.pointerUp(stage);
    fireEvent.pointerMove(stage, { clientX: 300 });
    fireEvent.pointerDown(stage, { clientX: 100 });
    fireEvent.pointerCancel(stage);
    fireEvent.pointerMove(stage, { clientX: 300 });

    expect(reading.impulse()).toBe(0);
  });

  it('leaves presses on links and buttons to them', () => {
    render(<Stage />);

    fireEvent.pointerDown(screen.getByRole('button', { name: 'Open tank' }), { clientX: 100 });
    fireEvent.pointerMove(screen.getByTestId('stage'), { clientX: 300 });

    expect(reading.impulse()).toBe(0);
    expect(capture).not.toHaveBeenCalled();
  });
});
