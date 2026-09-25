import { load } from 'cheerio';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

import { codesInTitle, parseWotexpressCodes } from '../wotexpress-codes';

const $ = load(readFileSync(new URL('./fixtures/wotexpress-bonus-codes.html', import.meta.url), 'utf8'));
const reference = new Date('2026-09-25T00:00:00Z');

describe('parseWotexpressCodes', () => {
  const codes = parseWotexpressCodes({ $, baseUrl: 'https://wotexpress.info/mir-tankov/bonus-kody/', reference });

  it('extracts one code per article of the saved listing', () => {
    expect(codes.map((code) => code.code)).toEqual(['MT2026TDAY', 'BDAYTANKISU', 'MTWORLDCUP26', 'MED26MT']);
  });

  it('keeps the article link and date', () => {
    expect(codes[0]?.sourceUrl.startsWith('https://wotexpress.info/mir-tankov/bonus-kody/')).toBe(true);
    expect(codes[0]?.publishedAt?.getUTCMonth()).toBe(8);
  });
});

describe('codesInTitle', () => {
  it('reads several codes after one heading and ignores plain words', () => {
    expect(codesInTitle('Бонус-коды ABC123DEF, XYZ789QWE для игроков')).toEqual(['ABC123DEF', 'XYZ789QWE']);
    expect(codesInTitle('Новые бонусы в игре')).toEqual([]);
  });
});
