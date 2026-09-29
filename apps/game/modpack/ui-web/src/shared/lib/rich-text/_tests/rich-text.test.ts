import { describe, expect, it } from 'vitest';

import { parseRichText } from '../rich-text';

describe(parseRichText, () => {
  it('splits lines and keeps nested font styles', () => {
    expect(parseRichText('<font color="#f2ead3" size="16">MoE <b>86.12%</b></font>\nplain')).toMatchObject([
      {
        runs: [
          { kind: 'text', text: 'MoE ', style: { color: '#F2EAD3', size: 16 } },
          { kind: 'text', text: '86.12%', style: { color: '#F2EAD3', size: 16, bold: true } }
        ]
      },
      { runs: [{ kind: 'text', text: 'plain', style: {} }] }
    ]);
  });

  it('closes only the matching tag and ignores unknown ones', () => {
    const lines = parseRichText("<font color='#7CD35B'><p>a</font></b>b<br/>c</i>");

    expect(lines).toMatchObject([
      {
        runs: [
          { kind: 'text', text: 'a', style: { color: '#7CD35B' } },
          { kind: 'text', text: 'b', style: {} }
        ]
      },
      { runs: [{ kind: 'text', text: 'c', style: {} }] }
    ]);
  });

  it('decodes entities and never turns them into markup', () => {
    expect(parseRichText('&lt;script&gt; &amp; &#8594; &#x2713;&nbsp;&bogus;')).toMatchObject([
      { runs: [{ kind: 'text', text: '<script> & → ✓ &bogus;', style: {} }] }
    ]);
  });

  it('keeps only game images and valid attributes', () => {
    expect(parseRichText('<img src="img://gui/maps/lamp.png" width="32" height="x"/><img src="https://evil"/>')).toMatchObject([
      { runs: [{ kind: 'image', src: 'img://gui/maps/lamp.png', width: 32, height: undefined }] }
    ]);

    expect(parseRichText('<font color="red" size="-3">x</font>')).toMatchObject([{ runs: [{ kind: 'text', text: 'x', style: {} }] }]);
  });

  it('keys every line and run by its place in the markup, so repeated text never shares a key', () => {
    const markup = 'x<img src="img://a.png"/>x\nx<br/>x<br>x';
    const lines = parseRichText(markup);
    const lineKeys = lines.map(({ key }) => key);

    expect(new Set(lineKeys).size).toBe(lines.length);
    lines.forEach(({ runs }) => expect(new Set(runs.map(({ key }) => key)).size).toBe(runs.length));
    expect(parseRichText(markup)).toEqual(lines);
  });

  it('returns one empty line for empty text', () => {
    expect(parseRichText('')).toMatchObject([{ runs: [] }]);
  });
});
