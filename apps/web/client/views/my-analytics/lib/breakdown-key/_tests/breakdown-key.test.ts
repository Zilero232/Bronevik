import { vehicleTypeSchema } from '@otmetki/schemas';
import { describe, expect, it } from 'vitest';

import { vehicleClassOf } from '../breakdown-key';

describe('vehicleClassOf', () => {
  it('recognises every vehicle class the contract knows', () => {
    vehicleTypeSchema.options.forEach((type) => expect(vehicleClassOf(type)).toBe(type));
  });

  it('returns null for a key that is not a vehicle class', () => {
    expect(vehicleClassOf('ussr')).toBeNull();
  });
});
