import { describe, expect, it } from 'vitest';

import { ogLabels } from '../og-labels';

describe('ogLabels', () => {
  it('reads the brand from the locale messages', () => {
    expect(ogLabels('ru').brand).toBe('Три отметки');
  });

  it('returns filled labels for every locale', () => {
    const { player, session, fallback } = ogLabels('en');

    expect([...Object.values(player), ...Object.values(session), fallback].every((label) => label.length > 0)).toBe(true);
  });
});
