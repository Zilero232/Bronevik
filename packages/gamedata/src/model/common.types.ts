import type { NATIONS } from './model.constants';

export type Nation = (typeof NATIONS)[number];

export type Currency = 'credits' | 'crystal' | 'equipCoin' | 'gold' | 'xp';

export type Price = {
  amount: number;
  currency: Currency;
};
