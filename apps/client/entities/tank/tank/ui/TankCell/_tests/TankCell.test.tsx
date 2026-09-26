import type { VehicleSummary } from '@otmetki/schemas';

import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { describe, expect, it } from 'vitest';

import { TankCell } from '../TankCell';

const VEHICLE: VehicleSummary = {
  tankId: 1,
  name: 'Object 140',
  shortName: 'Obj. 140',
  slug: 'object-140',
  nation: 'ussr',
  type: 'mediumTank',
  tier: 10,
  isPremium: false,
  isCollectible: false,
  images: { small: null, contour: null, big: null }
};

describe('TankCell', () => {
  it('names the tank by its short name and marks its nation', () => {
    const { container } = render(
      <NextIntlClientProvider locale='en' messages={{ game: { classes: { mediumTank: 'Medium tank' } } }}>
        <TankCell vehicle={VEHICLE} />
      </NextIntlClientProvider>
    );

    expect(screen.getByText('Obj. 140')).toBeTruthy();
    expect(container.firstElementChild?.getAttribute('data-nation')).toBe('ussr');
  });
});
