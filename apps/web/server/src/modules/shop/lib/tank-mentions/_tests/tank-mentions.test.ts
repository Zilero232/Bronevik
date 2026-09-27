import { describe, expect, it } from 'vitest';

import { matchTankNames } from '../tank-mentions';

const vehicles = [
  { tankId: 1, name: 'Т-103' },
  { tankId: 2, name: 'ИСУ-152К' },
  { tankId: 3, name: 'ИСУ-152' },
  { tankId: 4, name: 'Объект 252У Защитник' },
  { tankId: 5, name: 'T1' }
];

describe('matchTankNames', () => {
  it('finds whole names, including names with spaces', () => {
    expect(matchTankNames({ text: 'Выбери: Объект 252У  Защитник | ИСУ-152К | Т-103', vehicles, minLength: 3 })).toEqual([1, 2, 4]);
  });

  it('does not match a name that is only a prefix of a longer name', () => {
    expect(matchTankNames({ text: 'ИСУ-152К в продаже', vehicles, minLength: 3 })).toEqual([2]);
  });

  it('skips names shorter than the minimum', () => {
    expect(matchTankNames({ text: 'T1 heavy', vehicles, minLength: 3 })).toEqual([]);
  });
});
