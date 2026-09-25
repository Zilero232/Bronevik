import { describe, expect, it } from 'vitest';

import { applyModifier, matchesDeviceTags } from '../modifiers';

describe('applyModifier', () => {
  it('multiplies, adds and prefers the specialization value when asked', () => {
    const target: Record<string, number> = { reload: 1, speed: 0 };
    const reload = { attribute: 'reload', op: 'mul' as const, value: 0.9, specValue: 0.885 };

    applyModifier({ target, modifier: reload });
    applyModifier({ target, modifier: reload, specialized: true });
    applyModifier({ target, modifier: { attribute: 'speed', op: 'add', value: 4 } });

    expect(target.reload).toBeCloseTo(reload.value * reload.specValue);
    expect(target.speed).toBe(4);
  });

  it('starts missing attributes from the neutral element of the operation', () => {
    const target: Record<string, number> = {};

    applyModifier({ target, modifier: { attribute: 'a', op: 'mul', value: 2 } });
    applyModifier({ target, modifier: { attribute: 'b', op: 'add', value: 3 } });

    expect(target).toEqual({ a: 2, b: 3 });
  });
});

describe('matchesDeviceTags', () => {
  it('requires every tag of one installed device and none of the incompatible ones', () => {
    const filter = { required: ['rammer'], incompatible: ['deluxe'] };

    expect(matchesDeviceTags({ filter, installedTags: [['rammer', 'firepower']] })).toBe(true);
    expect(matchesDeviceTags({ filter, installedTags: [['rammer', 'deluxe']] })).toBe(false);
    expect(matchesDeviceTags({ filter, installedTags: [['ventilation']] })).toBe(false);
  });
});
