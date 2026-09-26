import { describe, expect, it } from 'vitest';

import type { VehicleRow } from '../vehicle-summary.types';

import { toVehicleSummary, unknownVehicle } from '../vehicle-summary';

const ROW: VehicleRow = {
  tankId: 1,
  name: 'Объект 268',
  shortName: 'Об. 268',
  slug: 'obj-268',
  nation: 'ussr',
  type: 'atSpg',
  tier: 10,
  isPremium: false,
  isCollectible: false,
  images: null
};

describe('toVehicleSummary', () => {
  it('maps the database vehicle type to the public one', () => {
    expect(toVehicleSummary(ROW).type).toBe('AT-SPG');
  });

  it('reads images under their primary or fallback key', () => {
    const summary = toVehicleSummary({
      ...ROW,
      images: { small: 'https://cdn.example/small.png', contour_icon: 'https://cdn.example/contour.png', preview: 'https://cdn.example/big.png' }
    });

    expect(summary.images).toEqual({
      small: 'https://cdn.example/small.png',
      contour: 'https://cdn.example/contour.png',
      big: 'https://cdn.example/big.png'
    });
  });

  it('skips values that are not valid URLs and tries the next key', () => {
    const summary = toVehicleSummary({ ...ROW, images: { small: 'not a url', small_icon: 'https://cdn.example/s.png', big: 42 } });

    expect(summary.images).toEqual({ small: 'https://cdn.example/s.png', contour: null, big: null });
  });

  it('returns empty images when the stored value is not an object', () => {
    expect(toVehicleSummary({ ...ROW, images: 'https://cdn.example/x.png' }).images).toEqual({ small: null, contour: null, big: null });
  });
});

describe('unknownVehicle', () => {
  it('names the placeholder after the tank id', () => {
    expect(unknownVehicle(123)).toMatchObject({ tankId: 123, name: '#123', slug: '123' });
  });
});
