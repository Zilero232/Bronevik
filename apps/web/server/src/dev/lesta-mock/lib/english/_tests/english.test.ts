import { describe, expect, it } from 'vitest';

import { englishName } from '../english';

describe('englishName', () => {
  it('turns arena, medal and skill keys into readable English names', () => {
    expect(englishName('01_karelia')).toBe('Karelia');
    expect(englishName('medalKolobanov')).toBe('Medal Kolobanov');
    expect(englishName('commander_sixthSense')).toBe('Commander Sixth Sense');
  });
});
