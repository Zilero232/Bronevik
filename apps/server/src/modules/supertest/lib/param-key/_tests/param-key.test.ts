import { describe, expect, it } from 'vitest';

import { paramMeta, paramOf, parsedUnit } from '../param-key';

describe('paramOf', () => {
  it.each([
    ['Время перезарядки', 'reloadTime'],
    ['Время перезарядки кассеты', 'clipReloadTime'],
    ['Время перезарядки между выстрелами в кассете', 'clipInterval'],
    ['Время сведения', 'aimingTime'],
    ['Разброс на 100 м', 'dispersion'],
    ['Разброс при движении', 'dispersionMovement'],
    ['Разброс при повороте башни', 'dispersionTurretRotation'],
    ['Разброс при повороте корпуса', 'dispersionHullRotation'],
    ['Средний урон', 'shellDamage'],
    ['Урон в минуту', 'damagePerMinute'],
    ['Бронепробиваемость подкалиберным снарядом', 'shellPenetration'],
    ['Прочность', 'maxHealth'],
    ['Обзор', 'viewRange'],
    ['Максимальная скорость', 'speedForward'],
    ['Максимальная скорость назад', 'speedBackward'],
    ['Скорость поворота башни', 'turretTraverse'],
    ['Скорость поворота корпуса', 'hullTraverse'],
    ['Мощность двигателя', 'enginePower'],
    ['Удельная мощность', 'powerToWeight'],
    ['Угол склонения орудия', 'depression'],
    ['Угол возвышения орудия', 'elevation'],
    ['Бронирование лобовой части башни', 'armorTurretFront'],
    ['Бронирование бортов корпуса', 'armorHullSide'],
    ['Скорость полёта снаряда', 'shellVelocity'],
    ['Скорострельность', 'rateOfFire']
  ])('maps «%s» to %s', (label, key) => {
    expect(paramOf(label)?.key).toBe(key);
  });

  it('returns null for a label that names no known characteristic', () => {
    expect(paramOf('Стоимость в кредитах')).toBeNull();
  });
});

describe('paramMeta', () => {
  it('marks time and dispersion as lower-is-better and damage as higher-is-better', () => {
    expect(paramMeta('reloadTime')?.isLowerBetter).toBe(true);
    expect(paramMeta('dispersion')?.isLowerBetter).toBe(true);
    expect(paramMeta('shellDamage')?.isLowerBetter).toBe(false);
  });

  it('returns null for an unknown or missing key', () => {
    expect(paramMeta('nope')).toBeNull();
    expect(paramMeta(null)).toBeNull();
  });
});

describe('parsedUnit', () => {
  it.each([
    ['с', 's'],
    ['сек.', 's'],
    ['м', 'm'],
    ['мм', 'mm'],
    ['км/ч', 'kmh'],
    ['ед.', 'hp'],
    ['л. с.', 'hp'],
    ['°', 'deg'],
    ['град/с', 'deg_s'],
    ['%', 'percent'],
    ['т', 't'],
    ['с (−5,6%)', 's']
  ])('normalises «%s» to %s', (text, unit) => {
    expect(parsedUnit(text)).toBe(unit);
  });

  it('returns null when there is no unit', () => {
    expect(parsedUnit('  ')).toBeNull();
  });
});
