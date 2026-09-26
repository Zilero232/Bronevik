import { describe, expect, it } from 'vitest';

import { coachContactLinks } from '../coach-contacts';

describe('coachContactLinks', () => {
  it('puts the booking link first and skips empty contacts', () => {
    const links = coachContactLinks({ telegram: 'https://t.me/coach', booking: 'https://cal.example/coach', vk: '' });

    expect(links.map(({ kind }) => kind)).toEqual(['booking', 'telegram']);
  });

  it('shows discord as text, not a link', () => {
    expect(coachContactLinks({ discord: 'coach#0001' })).toEqual([{ kind: 'discord', value: 'coach#0001', href: null }]);
  });

  it('is empty without contacts', () => {
    expect(coachContactLinks({})).toEqual([]);
  });
});
