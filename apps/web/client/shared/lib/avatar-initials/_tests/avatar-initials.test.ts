import { describe, expect, it } from 'vitest';

import { avatarHue, avatarInitials } from '../avatar-initials';

describe('avatarInitials', () => {
  it('takes the first letters of the first two words', () => {
    expect(avatarInitials('near_you tanker')).toBe('NY');
  });

  it('falls back to a placeholder for an empty name', () => {
    expect(avatarInitials('')).toBe('?');
  });
});

describe('avatarHue', () => {
  it('gives the same name the same hue inside the colour wheel', () => {
    expect(avatarHue('Jove')).toBe(avatarHue('Jove'));
    expect(avatarHue('Jove')).toBeLessThan(360);
  });
});
