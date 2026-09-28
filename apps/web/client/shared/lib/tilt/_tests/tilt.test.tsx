import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { TILT_HANDLERS } from '..';

const RECT = { left: 100, top: 50, width: 200, height: 100 };

const renderCard = () => {
  render(<div data-testid='card' {...TILT_HANDLERS} />);
  const card = screen.getByTestId('card');

  vi.spyOn(card, 'getBoundingClientRect').mockReturnValue(DOMRect.fromRect({ x: RECT.left, y: RECT.top, width: RECT.width, height: RECT.height }));

  return card;
};

const degrees = (card: HTMLElement, name: '--tilt-x' | '--tilt-y') => Number.parseFloat(card.style.getPropertyValue(name));

afterEach(() => {
  vi.restoreAllMocks();
});

describe('TILT_HANDLERS', () => {
  it('leaves the card flat when the mouse is at its centre', () => {
    const card = renderCard();

    fireEvent.pointerMove(card, { pointerType: 'mouse', clientX: RECT.left + RECT.width / 2, clientY: RECT.top + RECT.height / 2 });

    expect(degrees(card, '--tilt-x')).toBeCloseTo(0);
    expect(degrees(card, '--tilt-y')).toBeCloseTo(0);
  });

  it('tilts towards the pointer with opposite signs at opposite corners', () => {
    const card = renderCard();

    fireEvent.pointerMove(card, { pointerType: 'mouse', clientX: RECT.left + RECT.width, clientY: RECT.top });
    const topRight = { x: degrees(card, '--tilt-x'), y: degrees(card, '--tilt-y') };

    fireEvent.pointerMove(card, { pointerType: 'mouse', clientX: RECT.left, clientY: RECT.top + RECT.height });
    const bottomLeft = { x: degrees(card, '--tilt-x'), y: degrees(card, '--tilt-y') };

    expect(topRight.x).toBeGreaterThan(0);
    expect(topRight.y).toBeGreaterThan(0);
    expect(bottomLeft.x).toBeCloseTo(-topRight.x);
    expect(bottomLeft.y).toBeCloseTo(-topRight.y);
  });

  it('ignores touch and pen pointers', () => {
    const card = renderCard();

    fireEvent.pointerMove(card, { pointerType: 'touch', clientX: RECT.left, clientY: RECT.top });

    expect(card.style.getPropertyValue('--tilt-x')).toBe('');
  });

  it('resets the tilt when the pointer leaves', () => {
    const card = renderCard();

    fireEvent.pointerMove(card, { pointerType: 'mouse', clientX: RECT.left, clientY: RECT.top });
    fireEvent.pointerLeave(card);

    expect(card.style.getPropertyValue('--tilt-x')).toBe('');
    expect(card.style.getPropertyValue('--tilt-y')).toBe('');
  });
});
