import { describe, expect, it } from 'vitest';

import { openButton } from '../keyboard';

describe('openButton', () => {
  it('builds a single URL button for a public https link', () => {
    const keyboard = openButton({ label: 'Open', url: 'https://triotmetki.ru/p/Tanker' });

    expect(keyboard?.inline_keyboard).toEqual([[{ text: 'Open', url: 'https://triotmetki.ru/p/Tanker' }]]);
  });

  it.each(['http://triotmetki.ru/p/Tanker', 'https://localhost:3000/p/Tanker', 'not a url'])('leaves out the button for %s', (url) => {
    expect(openButton({ label: 'Open', url })).toBeUndefined();
  });
});
