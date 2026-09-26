import { BRONYA_INDEX } from '@otmetki/ratings';
import { describe, expect, it } from 'vitest';

import { bronyaReferencePayload, parseBronyaReference } from '../bronya-reference';

const ramp = (scale: number) => BRONYA_INDEX.quantileLevels.map((level) => level * scale);

const components = { damage: ramp(3000), winRate: ramp(70), frags: ramp(2), spotted: ramp(3), defence: ramp(1) };

describe('bronya reference payload', () => {
  it('round-trips through the stored JSON', () => {
    const payload = bronyaReferencePayload({ players: 100, components });

    expect(parseBronyaReference({ tankId: 7, value: JSON.parse(JSON.stringify(payload)) })).toEqual({ tankId: 7, quantiles: components });
  });

  it('rejects a payload of another kind', () => {
    expect(parseBronyaReference({ tankId: 7, value: { 50: 1000 } })).toBeNull();
  });

  it('rejects quantiles that are not monotonic', () => {
    const broken = { ...components, damage: [...components.damage].reverse() };

    expect(parseBronyaReference({ tankId: 7, value: bronyaReferencePayload({ players: 100, components: broken }) })).toBeNull();
  });
});
