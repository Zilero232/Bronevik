import { describe, expect, it } from 'vitest';

import { SITE } from '@/shared/config/site';

import { breadcrumbJsonLd, jsonLdText, siteJsonLd } from '../json-ld';

describe('jsonLdText', () => {
  it('escapes a closing script tag', () => {
    expect(jsonLdText({ name: '</script>' })).not.toContain('</script>');
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
