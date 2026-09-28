import { describe, expect, it } from 'vitest';

import { parseRichText } from '../rich-text';

describe(parseRichText, () => {
  it('splits lines and keeps nested font styles', () => {
    expect(parseRichText('<font color="#f2ead3" size="16">MoE <b>86.12%</b></font>\nplain')).toEqual([
      [
        { kind: 'text', text: 'MoE ', style: { color: '#F2EAD3', size: 16 } },
        { kind: 'text', text: '86.12%', style: { color: '#F2EAD3', size: 16, bold: true } }
      ],
      [{ kind: 'text', text: 'plain', style: {} }]
    ]);
  });

  it('closes only the matching tag and ignores unknown ones', () => {
    const lines = parseRichText("<font color='#7CD35B'><p>a</font></b>b<br/>c</i>");

    expect(lines).toEqual([
      [
        { kind: 'text', text: 'a', style: { color: '#7CD35B' } },
        { kind: 'text', text: 'b', style: {} }
      ],
      [{ kind: 'text', text: 'c', style: {} }]
    ]);
  });

  it('decodes entities and never turns them into markup', () => {
    expect(parseRichText('&lt;script&gt; &amp; &#8594; &#x2713;&nbsp;&bogus;')).toEqual([
      [{ kind: 'text', text: '<script> & → ✓ &bogus;', style: {} }]
    ]);
  });

  it('keeps only game images and valid attributes', () => {
    expect(parseRichText('<img src="img://gui/maps/lamp.png" width="32" height="x"/><img src="https://evil"/>')).toEqual([
      [{ kind: 'image', src: 'img://gui/maps/lamp.png', width: 32, height: undefined }]
    ]);

    expect(parseRichText('<font color="red" size="-3">x</font>')).toEqual([[{ kind: 'text', text: 'x', style: {} }]]);
  });

  it('returns one empty line for empty text', () => {
    expect(parseRichText('')).toEqual([[]]);
  });
});
