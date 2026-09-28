import type { MapSummary } from '@otmetki/schemas';

import { describe, expect, it } from 'vitest';

import { LOCALIZED_TEXT } from '@/shared/lib';

import { localizedMap } from '../localized-map';

const map: MapSummary = {
  arenaId: '01_karelia',
  slug: 'karelia',
  name: 'Карелия',
  nameEn: 'Karelia',
  image: null,
  sizeMeters: 1000,
  camouflage: 'summer',
  modes: ['ctf']
};

describe('localizedMap', () => {
  it('shows the English name only on the English site', () => {
    expect(localizedMap({ map, locale: LOCALIZED_TEXT.english }).name).toBe('Karelia');
    expect(localizedMap({ map, locale: 'ru' }).name).toBe('Карелия');
  });
});
