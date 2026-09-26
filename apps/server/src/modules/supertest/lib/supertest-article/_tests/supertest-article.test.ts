import { describe, expect, it } from 'vitest';

import { isSupertestTitle, parseSupertestArticle } from '../supertest-article';

const VEHICLES = [
  { tankId: 7169, name: 'ИС-7' },
  { tankId: 13889, name: 'Т-34' },
  { tankId: 15617, name: 'Т-34-85' },
  { tankId: 58641, name: 'Объект 780' },
  { tankId: 6225, name: 'Leopard 1' }
] as const;

const BALANCE_ARTICLE = [
  'Танкисты!',
  'На супертесте проходят проверку изменения баланса нескольких машин.',
  'ИС-7',
  '• Время перезарядки: 12,5 с → 11,8 с',
  '• Разброс на 100 м: 0,38 → 0,35 м',
  '• Прочность: 2 400 → 2 550 ед.',
  'Leopard 1',
  '— Время сведения уменьшено с 1,9 до 1,7 с.',
  '— Бронепробиваемость: было 268 мм, стало 258 мм',
  '— Угол склонения орудия: −9° → −10°',
  'Изменения не окончательные и могут быть скорректированы.'
];

describe('parseSupertestArticle', () => {
  it('groups arrow, range and «было/стало» changes under the catalog tank they follow', () => {
    const tanks = parseSupertestArticle({ lines: BALANCE_ARTICLE, vehicles: VEHICLES });

    expect(tanks.map((tank) => tank.tankId)).toEqual([7169, 6225]);
    expect(tanks[0]?.changes.map((change) => change.param)).toEqual(['reloadTime', 'dispersion', 'maxHealth']);
    expect(tanks[1]?.changes.map((change) => change.param)).toEqual(['aimingTime', 'shellPenetration', 'depression']);
  });

  it('keeps announced old and new values with a normalised unit', () => {
    const [is7] = parseSupertestArticle({ lines: BALANCE_ARTICLE, vehicles: VEHICLES });

    expect(is7?.changes[0]).toMatchObject({ from: 12.5, to: 11.8, unit: 's', label: 'Время перезарядки' });
    expect(is7?.changes[2]).toMatchObject({ from: 2400, to: 2550, unit: 'hp' });
  });

  it('stores gun depression as a positive angle so a bigger number means more depression', () => {
    const [, leopard] = parseSupertestArticle({ lines: BALANCE_ARTICLE, vehicles: VEHICLES });
    const depression = leopard?.changes.find((change) => change.param === 'depression');

    expect(depression?.to).toBeGreaterThan(depression?.from ?? Infinity);
  });

  it('does not mark catalog tanks as new vehicles without a marker', () => {
    const tanks = parseSupertestArticle({ lines: BALANCE_ARTICLE, vehicles: VEHICLES });

    expect(tanks.every((tank) => !tank.isNewVehicle)).toBe(true);
  });

  it('picks the longest catalog name so «Т-34-85» is not read as «Т-34»', () => {
    const [tank] = parseSupertestArticle({ lines: ['Т-34-85', 'Обзор: 360 → 370 м'], vehicles: VEHICLES });

    expect(tank?.tankId).toBe(15617);
  });

  it('reads an unknown heading followed by characteristics as a new vehicle', () => {
    const [tank] = parseSupertestArticle({
      lines: ['На супертест выходит новая машина.', 'Kampfpanzer 07 RH', 'Прочность: 1 950 ед.', 'Обзор: 400 м', 'Время перезарядки: 8,4 с'],
      vehicles: VEHICLES
    });

    expect(tank).toMatchObject({ tankId: null, name: 'Kampfpanzer 07 RH', isNewVehicle: true });

    expect(tank?.changes.map((change) => [change.param, change.from, change.to])).toEqual([
      ['maxHealth', null, 1950],
      ['viewRange', null, 400],
      ['reloadTime', null, 8.4]
    ]);
  });

  it('marks a catalog tank as new when a marker line precedes it', () => {
    const [tank] = parseSupertestArticle({
      lines: ['Новая машина на супертесте:', 'Объект 780', 'Прочность: 2 600 ед.'],
      vehicles: VEHICLES
    });

    expect(tank).toMatchObject({ tankId: 58641, isNewVehicle: true });
  });

  it('reads table rows split into label and value cells', () => {
    const [tank] = parseSupertestArticle({
      lines: ['ИС-7', 'Параметр', 'Было', 'Стало', 'Время сведения', '2,3 с', '2,1 с', 'Обзор', '390 м', '400 м'],
      vehicles: VEHICLES
    });

    expect(tank?.changes.map((change) => [change.param, change.from, change.to, change.unit])).toEqual([
      ['aimingTime', 2.3, 2.1, 's'],
      ['viewRange', 390, 400, 'm']
    ]);
  });

  it('splits several changes written on one line', () => {
    const [tank] = parseSupertestArticle({
      lines: ['ИС-7', 'Время сведения: 2,3 → 2,1 с; Обзор: 390 → 400 м'],
      vehicles: VEHICLES
    });

    expect(tank?.changes.map((change) => change.param)).toEqual(['aimingTime', 'viewRange']);
  });

  it('keeps a worded change without numbers as a text change', () => {
    const [tank] = parseSupertestArticle({
      lines: ['ИС-7', 'Улучшено бронирование лобовой части башни.'],
      vehicles: VEHICLES
    });

    expect(tank?.changes).toEqual([
      {
        param: 'armorTurretFront',
        label: 'Улучшено бронирование лобовой части башни.',
        from: null,
        to: null,
        unit: 'mm',
        raw: 'Улучшено бронирование лобовой части башни.'
      }
    ]);
  });

  it('ignores parameter lines that appear before any tank', () => {
    expect(parseSupertestArticle({ lines: ['Время перезарядки: 10 → 9 с'], vehicles: VEHICLES })).toEqual([]);
  });

  it('does not take section headings for new vehicle names', () => {
    const tanks = parseSupertestArticle({ lines: ['Огневая мощь', 'Время перезарядки: 10 → 9 с'], vehicles: VEHICLES });

    expect(tanks).toEqual([]);
  });

  it('merges a tank that appears in two sections', () => {
    const tanks = parseSupertestArticle({
      lines: ['ИС-7', 'Обзор: 390 → 400 м', 'Leopard 1', 'Обзор: 400 → 410 м', 'ИС-7', 'Прочность: 2 400 → 2 550'],
      vehicles: VEHICLES
    });

    expect(tanks.find((tank) => tank.tankId === 7169)?.changes).toHaveLength(2);
  });
});

describe('isSupertestTitle', () => {
  it('matches supertest announcements in either spelling', () => {
    expect(isSupertestTitle('Супертест: изменения баланса')).toBe(true);
    expect(isSupertestTitle('На супер тест отправляется новая ветка')).toBe(true);
  });

  it('does not match other news', () => {
    expect(isSupertestTitle('Общий тест обновления 2.1')).toBe(false);
  });
});
