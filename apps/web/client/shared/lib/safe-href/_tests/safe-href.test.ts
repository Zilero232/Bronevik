import { describe, expect, it } from 'vitest';

import { isExternalHref, safeHref, safeWebHref } from '../safe-href';
import { SAFE_HREF } from '../safe-href.constants';

const SCRIPT_LIKE = [
  'javascript:alert(1)',
  'JaVaScRiPt:alert(1)',
  'java\tscript:alert(1)',
  ' javascript:alert(1)',
  'data:text/html,<b>x</b>',
  'vbscript:x'
];

describe('safeHref', () => {
  it('drops every href whose scheme is not allowed', () => {
    SCRIPT_LIKE.forEach((href) => expect(safeHref(href)).toBeUndefined());
    expect(safeHref('ftp://files.example.com')).toBeUndefined();
  });

  it('keeps every allowed scheme and relative links', () => {
    SAFE_HREF.protocols.forEach((protocol) => expect(safeHref(`${protocol}//example.com`)).toBe(`${protocol}//example.com`));
    expect(safeHref('/guides')).toBe('/guides');
    expect(safeHref('#tactics')).toBe('#tactics');
  });

  it('treats an empty value as no link', () => {
    expect(safeHref('')).toBeUndefined();
    expect(safeHref(null)).toBeUndefined();
    expect(safeHref(undefined)).toBeUndefined();
  });
});

describe('safeWebHref', () => {
  it('accepts only absolute web links', () => {
    SAFE_HREF.webProtocols.forEach((protocol) => expect(safeWebHref(`${protocol}//example.com`)).toBe(`${protocol}//example.com`));
    SCRIPT_LIKE.forEach((href) => expect(safeWebHref(href)).toBeUndefined());
    expect(safeWebHref('mailto:someone@example.com')).toBeUndefined();
    expect(safeWebHref('/relative')).toBeUndefined();
    expect(safeWebHref('@nickname')).toBeUndefined();
  });
});

describe('isExternalHref', () => {
  it('treats allowed schemes and protocol-relative links as external', () => {
    expect(isExternalHref('https://tanki.su')).toBe(true);
    expect(isExternalHref('//cdn.example.com/x')).toBe(true);
    expect(isExternalHref('/\\evil.example.com')).toBe(true);
    expect(isExternalHref('\\\\evil.example.com')).toBe(true);
  });

  it('keeps relative paths internal', () => {
    expect(isExternalHref('/guides')).toBe(false);
    expect(isExternalHref(undefined)).toBe(false);
  });
});
