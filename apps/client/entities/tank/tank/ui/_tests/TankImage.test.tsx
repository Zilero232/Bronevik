import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import type { TankIdentityData } from '../../model/tank.types';

import { TANK_IMAGE } from '../../config';
import { TankImage } from '../TankImage';

const TANK: TankIdentityData = {
  name: 'Kranvagn',
  nation: 'sweden',
  type: 'heavyTank',
  tier: 10,
  isPremium: false,
  images: {
    big: 'https://api.tanki.su/static/2.80.0/wot/encyclopedia/vehicle/sweden-S16_Kranvagn.png',
    small: 'https://api.tanki.su/static/2.80.0/wot/encyclopedia/vehicle/small/sweden-S16_Kranvagn.png',
    contour: 'https://api.tanki.su/static/2.80.0/wot/encyclopedia/vehicle/contour/sweden-S16_Kranvagn.png'
  }
};

const rootOf = (container: HTMLElement) => container.firstElementChild;

describe('TankImage', () => {
  it('shows the render for the requested size at its native dimensions', () => {
    render(<TankImage size='small' tank={TANK} />);

    const image = screen.getByRole('img', { name: TANK.name });

    expect(image.getAttribute('src')).toBe(TANK.images?.small);
    expect(image.getAttribute('width')).toBe(String(TANK_IMAGE.small.width));
    expect(image.getAttribute('height')).toBe(String(TANK_IMAGE.small.height));
  });

  it('falls back to the class glyph and tier when the vehicle has no image', () => {
    const { container } = render(<TankImage size='contour' tank={{ ...TANK, images: null }} />);

    expect(rootOf(container)?.getAttribute('data-state')).toBe('fallback');
    expect(screen.getByRole('img', { name: TANK.name }).textContent).toBe('X');
  });

  it('falls back when the image fails to load', () => {
    const { container } = render(<TankImage size='contour' tank={TANK} />);

    fireEvent.error(screen.getByRole('img', { name: TANK.name }));

    expect(rootOf(container)?.getAttribute('data-state')).toBe('fallback');
  });

  it('renders nothing instead of a fallback when asked to', () => {
    const { container } = render(<TankImage size='small' tank={{ ...TANK, images: null }} withFallback={false} />);

    expect(container).toBeEmptyDOMElement();
  });

  it('draws the premium fallback glyph in gold', () => {
    const { container } = render(<TankImage size='contour' tank={{ ...TANK, isPremium: true, images: null }} />);

    expect(container.querySelector('svg')?.getAttribute('data-variant')).toBe('premium');
  });

  it('puts a nation flag behind big renders only', () => {
    const big = render(<TankImage size='big' tank={{ ...TANK, images: null }} />);
    const small = render(<TankImage size='small' tank={{ ...TANK, images: null }} />);

    expect(big.container.querySelectorAll('svg')).toHaveLength(2);
    expect(small.container.querySelectorAll('svg')).toHaveLength(1);
  });
});
