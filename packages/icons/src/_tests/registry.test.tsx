import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ICON_GROUPS, ICONS, isNation, NATION_ICONS, NATIONS, TANK_CLASS_ICONS, TANK_CLASSES } from '../registry';

describe('icon registry', () => {
  it('lists every registered icon in exactly one group', () => {
    const grouped = Object.values(ICON_GROUPS).flat();

    expect(new Set(grouped).size).toBe(grouped.length);
    expect([...grouped].sort()).toEqual(Object.keys(ICONS).sort());
  });

  it('covers every tank class and nation', () => {
    TANK_CLASSES.forEach((tankClass) => expect(TANK_CLASS_ICONS[tankClass]).toBeDefined());
    NATIONS.forEach((nation) => expect(NATION_ICONS[nation]).toBeDefined());
  });

  it('recognises only the nations it has icons for', () => {
    NATIONS.forEach((nation) => expect(isNation(nation)).toBe(true));
    expect(isNation('atlantis')).toBe(false);
  });

  it('renders every icon as a lucide-compatible svg', () => {
    Object.values(ICONS).forEach((Icon) => {
      const { container, unmount } = render(<Icon size={32} strokeWidth={1.5} />);
      const svg = container.querySelector('svg');

      expect(svg?.getAttribute('viewBox')).toBe('0 0 24 24');
      expect(svg?.getAttribute('stroke')).toBe('currentColor');
      expect(svg?.getAttribute('stroke-width')).toBe('1.5');
      expect(svg?.getAttribute('width')).toBe('32');

      unmount();
    });
  });

  it('exposes a title as an accessible image', () => {
    const Icon = ICONS['class-heavy'];
    const { getByRole } = render(<Icon title='Heavy' />);

    expect(getByRole('img', { name: 'Heavy' }).tagName.toLowerCase()).toBe('svg');
  });
});
