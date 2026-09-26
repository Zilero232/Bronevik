import { TANK_CLASSES, TIERS } from '@bronevik/icons';
import { describe, expect, it } from 'vitest';

import { groupKeyOf } from '../group-key';

describe('groupKeyOf', () => {
  it('reads every vehicle class as a class group', () => {
    TANK_CLASSES.forEach((type) => expect(groupKeyOf(type)).toEqual({ kind: 'class', type }));
  });

  it('reads every tier number as a tier group', () => {
    TIERS.forEach((tier) => expect(groupKeyOf(String(tier))).toEqual({ kind: 'tier', tier }));
  });

  it('keeps an unknown key as it came', () => {
    expect(groupKeyOf('mystery')).toEqual({ kind: 'raw', key: 'mystery' });
  });
});
