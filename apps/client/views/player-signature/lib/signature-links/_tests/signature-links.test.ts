import { describe, expect, it } from 'vitest';

import { signatureLinks } from '../signature-links';

describe('signatureLinks', () => {
  const links = signatureLinks({ nickname: 'Top_Player', apiUrl: 'https://api.triotmetki.ru', siteUrl: 'https://triotmetki.ru' });

  it('points the image at the API signature route and the link at the profile', () => {
    expect(links.imageUrl).toBe('https://api.triotmetki.ru/sig/Top_Player.png');
    expect(links.profileUrl).toBe('https://triotmetki.ru/p/Top_Player');
    expect(links.image).toBe(links.imageUrl);
  });

  it('builds forum, HTML and Markdown snippets', () => {
    expect(links.bbcode).toBe('[url=https://triotmetki.ru/p/Top_Player][img]https://api.triotmetki.ru/sig/Top_Player.png[/img][/url]');

    expect(links.html).toBe(
      '<a href="https://triotmetki.ru/p/Top_Player"><img src="https://api.triotmetki.ru/sig/Top_Player.png" width="468" height="100" alt="Top_Player"></a>'
    );

    expect(links.markdown).toBe('[![Top_Player](https://api.triotmetki.ru/sig/Top_Player.png)](https://triotmetki.ru/p/Top_Player)');
  });
});
