import { describe, expect, it } from 'vitest';

import { returnUrl, safeReturnPath } from '../return-path';

describe('safeReturnPath', () => {
  it('keeps a same-origin path with its query and hash', () => {
    expect(safeReturnPath('/t/is-7?tab=armor#pen')).toBe('/t/is-7?tab=armor#pen');
    expect(safeReturnPath('/plus?ref=abc')).toBe('/plus?ref=abc');
  });

  it('rejects empty and relative values', () => {
    expect(safeReturnPath(null)).toBeNull();
    expect(safeReturnPath(undefined)).toBeNull();
    expect(safeReturnPath('')).toBeNull();
    expect(safeReturnPath('tanks')).toBeNull();
  });

  it('rejects other origins and schemes', () => {
    expect(safeReturnPath('https://evil.example/')).toBeNull();
    expect(safeReturnPath('//evil.example/')).toBeNull();
    expect(safeReturnPath(String.raw`/\evil.example/`)).toBeNull();
    expect(safeReturnPath('/\t/evil.example/')).toBeNull();
    expect(safeReturnPath('javascript:alert(1)')).toBeNull();
  });

  it('drops the locale prefix so the router can add the current one', () => {
    expect(safeReturnPath('/en/tanks?tier=10')).toBe('/tanks?tier=10');
    expect(safeReturnPath('/en')).toBe('/');
    expect(safeReturnPath('/ru/me')).toBe('/me');
  });

  it('never returns to the login pages', () => {
    expect(safeReturnPath('/login')).toBeNull();
    expect(safeReturnPath('/en/login?next=%2Fme')).toBeNull();
    expect(safeReturnPath('/login/telegram?code=x')).toBeNull();
  });

  it('keeps paths that only start like login', () => {
    expect(safeReturnPath('/loginx')).toBe('/loginx');
  });
});

describe('returnUrl', () => {
  const origin = 'http://localhost:3000';

  it('builds an absolute url in the current locale', () => {
    expect(returnUrl({ path: '/plus?ref=abc', locale: 'ru', origin })).toBe(`${origin}/plus?ref=abc`);
    expect(returnUrl({ path: '/plus?ref=abc', locale: 'en', origin })).toBe(`${origin}/en/plus?ref=abc`);
  });
});
