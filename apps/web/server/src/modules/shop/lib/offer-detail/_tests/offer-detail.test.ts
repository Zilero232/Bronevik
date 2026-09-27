import { load } from 'cheerio';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

import { bonusCodesOf, discountsOf, parseOfferDetail } from '../offer-detail';

const $ = load(readFileSync(new URL('./fixtures/tanki-offer-detail.html', import.meta.url), 'utf8'));
const publishedAt = new Date('2026-05-06T09:00:00Z');

describe('parseOfferDetail', () => {
  const detail = parseOfferDetail({ $, publishedAt });

  it('finds the promo code printed in the saved Victory Day offer', () => {
    expect(detail.bonusCodes).toEqual(['VDAY2026MT']);
  });

  it('takes the latest deadline of the offer as its end', () => {
    expect(detail.endsAt?.toISOString()).toBe('2026-05-18T06:00:00.000Z');
  });

  it('only counts discounts that mention vehicles as a tank discount', () => {
    const vehicleDiscounts = detail.discounts.filter((discount) => /танк|техник/i.test(discount.context)).map((discount) => discount.percent);

    expect(detail.tankDiscountPercent).toBe(Math.max(...vehicleDiscounts));
    expect(detail.discounts.length).toBeGreaterThan(vehicleDiscounts.length);
  });

  it('keeps the tank names for matching', () => {
    expect(detail.text).toContain('Объект 252У Защитник');
  });
});

describe('discountsOf', () => {
  it('reads the percent and the line after it', () => {
    expect(discountsOf(['СКИДКА 15%', 'на премиум танки VIII-IX уровней'])).toEqual([
      { percent: 15, context: 'СКИДКА 15% на премиум танки VIII-IX уровней' }
    ]);
  });
});

describe('bonusCodesOf', () => {
  it('needs both letters and digits so headings and numbers are not codes', () => {
    expect(bonusCodesOf(['ПОДАРКИ', 'X5', '2026', 'MT2026TDAY', 'MT2026TDAY'])).toEqual(['MT2026TDAY']);
  });
});
