import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Avatar } from '../Avatar';
import { avatarHue, avatarInitials } from '../Avatar.helpers';

describe('avatarInitials', () => {
  it('takes the first letter of the first two words', () => {
    expect(avatarInitials('Grom_i_Molniya')).toBe('GI');
    expect(avatarInitials('tihiy ohotnik')).toBe('TO');
  });

  it('keeps a one-word name to one letter', () => {
    expect(avatarInitials('Stalevar')).toBe('S');
  });

  it('never renders an empty avatar', () => {
    expect(avatarInitials('__')).toBe('?');
  });
});

describe('avatarHue', () => {
  it('is stable for a name and stays on the colour wheel', () => {
    ['Stalevar_1987', 'Kotik_v_Tigre', 'Я'].forEach((name) => {
      const hue = avatarHue(name);

      expect(hue).toBe(avatarHue(name));
      expect(hue).toBeGreaterThanOrEqual(0);
      expect(hue).toBeLessThan(360);
    });
  });
});

describe('Avatar', () => {
  it('falls back to the initials when there is no picture', () => {
    render(<Avatar name='Grom_i_Molniya' />);

    expect(screen.getByText('GI')).toBeInTheDocument();
  });
});
