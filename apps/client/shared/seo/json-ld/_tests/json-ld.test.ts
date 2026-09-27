import { describe, expect, it } from 'vitest';

import { SITE } from '@/shared/config/site';

import { breadcrumbJsonLd, clanJsonLd, jsonLdText, organizationJsonLd, personJsonLd, siteJsonLd } from '../json-ld';

describe('jsonLdText', () => {
  it('escapes a closing script tag', () => {
    expect(jsonLdText({ name: '</script>' })).not.toContain('</script>');
  });

  it('escapes every opening bracket and still parses back to the same data', () => {
    const data = { name: '<b>a</b> < c' };
    const text = jsonLdText(data);

    expect(text).not.toContain('<');
    expect(JSON.parse(text)).toEqual(data);
  });
});

describe('organizationJsonLd', () => {
  it('points the logo at an absolute url on the site', () => {
    expect(organizationJsonLd().logo).toBe(new URL('/icon.svg', SITE.url).toString());
  });
});

describe('personJsonLd', () => {
  it('describes a player profile page with its locale url and avatar', () => {
    expect(personJsonLd({ name: 'Tanker', path: '/p/Tanker', locale: 'en', image: 'https://cdn.test/a.png' })).toEqual({
      '@context': 'https://schema.org',
      '@type': 'ProfilePage',
      url: `${SITE.url}/en/p/Tanker`,
      mainEntity: { '@type': 'Person', name: 'Tanker', url: `${SITE.url}/en/p/Tanker`, image: 'https://cdn.test/a.png' }
    });
  });

  it('leaves the image out when the player has none', () => {
    expect(personJsonLd({ name: 'Tanker', path: '/p/Tanker', locale: 'ru', image: null }).mainEntity).toEqual({
      '@type': 'Person',
      name: 'Tanker',
      url: `${SITE.url}/p/Tanker`
    });
  });
});

describe('clanJsonLd', () => {
  it('uses the clan emblem as the team logo', () => {
    expect(clanJsonLd({ name: 'RED', path: '/c/RED', locale: 'ru', image: 'https://cdn.test/red.png' })).toEqual({
      '@context': 'https://schema.org',
      '@type': 'SportsTeam',
      name: 'RED',
      url: `${SITE.url}/c/RED`,
      logo: 'https://cdn.test/red.png'
    });
  });

  it('omits the logo for a clan without an emblem', () => {
    expect(clanJsonLd({ name: 'RED', path: '/c/RED', locale: 'en' })).not.toHaveProperty('logo');
  });
});

describe('breadcrumbJsonLd', () => {
  it('numbers the crumbs and links only those with a path', () => {
    const list = breadcrumbJsonLd({ items: [{ name: 'Танки', path: '/tanks' }, { name: 'ИС-7' }], locale: 'en' });

    expect(list.itemListElement).toEqual([
      { '@type': 'ListItem', position: 1, name: 'Танки', item: `${SITE.url}/en/tanks` },
      { '@type': 'ListItem', position: 2, name: 'ИС-7' }
    ]);
  });
});

describe('siteJsonLd', () => {
  it('keeps the search placeholder unescaped', () => {
    expect(jsonLdText(siteJsonLd('ru'))).toContain('/p/{search_term_string}');
  });
});
