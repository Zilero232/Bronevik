import type { ReactElement } from 'react';

import { fireEvent, render as renderBare, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { describe, expect, it } from 'vitest';

import { messages } from '@/shared/i18n';

import type { TankImageSubject } from '../TankImage.types';

import { TankImage } from '../TankImage';

const IMAGES = { small: 'https://img.test/object-140-small.png', contour: null, big: 'https://img.test/object-140-big.png' };

const TANK: TankImageSubject = {
  name: 'Object 140',
  type: 'mediumTank',
  tier: 10,
  nation: 'ussr',
  isPremium: false,
  images: IMAGES
};

const render = (ui: ReactElement) =>
  renderBare(
    <NextIntlClientProvider locale='en' messages={messages.en} timeZone='UTC'>
      {ui}
    </NextIntlClientProvider>
  );

const WITHOUT_IMAGES: TankImageSubject = { ...TANK, images: null };

describe('TankImage', () => {
  it('shows the picture named after the tank', () => {
    render(<TankImage size='big' tank={TANK} />);

    expect(screen.getByRole('img', { name: TANK.name })).toHaveAttribute('src', expect.stringContaining('object-140'));
  });

  it('swaps to the class-icon fallback when the picture fails to load', () => {
    render(<TankImage size='small' tank={TANK} />);

    fireEvent.error(screen.getByRole('img', { name: TANK.name }));

    const fallback = screen.getByRole('img', { name: TANK.name });

    expect(fallback.tagName).not.toBe('IMG');
  });

  it('shows the large render and falls back to the big icon when it fails', () => {
    render(<TankImage size='large' tank={{ ...TANK, images: { ...IMAGES, large: 'https://img.test/object-140-large.png' } }} />);

    expect(screen.getByRole('img', { name: TANK.name })).toHaveAttribute('src', expect.stringContaining('object-140-large'));

    fireEvent.error(screen.getByRole('img', { name: TANK.name }));

    expect(screen.getByRole('img', { name: TANK.name })).toHaveAttribute('src', expect.stringContaining('object-140-big'));
  });

  it('uses the fallback when the tank has no picture of that size', () => {
    render(<TankImage size='contour' tank={TANK} />);

    expect(screen.getByRole('img', { name: TANK.name }).tagName).not.toBe('IMG');
  });

  it('renders nothing when there is no picture and the fallback is off', () => {
    render(<TankImage size='big' tank={WITHOUT_IMAGES} withFallback={false} />);

    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(screen.queryByText(TANK.name)).not.toBeInTheDocument();
  });

  it('hides a decorative image from assistive technology', () => {
    render(<TankImage isDecorative size='big' tank={TANK} />);

    expect(screen.queryByRole('img', { name: TANK.name })).not.toBeInTheDocument();
  });

  it('hides a decorative fallback from assistive technology', () => {
    render(<TankImage isDecorative size='big' tank={WITHOUT_IMAGES} />);

    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });
});
