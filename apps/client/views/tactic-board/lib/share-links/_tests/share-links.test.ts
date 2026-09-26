import { describe, expect, it } from 'vitest';

import { boardShareLinks } from '../share-links';

const INPUT = { origin: 'https://otmetki.su/', path: '/en/tactics/abc', shareToken: 'view1234', editToken: 'edit5678' };

describe('boardShareLinks', () => {
  it('builds the view and edit links on the localized board path', () => {
    const links = boardShareLinks(INPUT);

    expect(links.view).toBe('https://otmetki.su/en/tactics/abc?token=view1234');
    expect(links.edit).toBe('https://otmetki.su/en/tactics/abc?token=edit5678');
  });

  it('keeps the plain link token-free for public boards', () => {
    expect(boardShareLinks(INPUT).plain).toBe('https://otmetki.su/en/tactics/abc');
  });

  it('gives no link for a token the viewer does not hold', () => {
    const links = boardShareLinks({ ...INPUT, shareToken: null, editToken: null });

    expect(links.view).toBeNull();
    expect(links.edit).toBeNull();
  });

  it('escapes characters that would break the query string', () => {
    expect(boardShareLinks({ ...INPUT, shareToken: 'a&b=c' }).view).toBe('https://otmetki.su/en/tactics/abc?token=a%26b%3Dc');
  });
});
