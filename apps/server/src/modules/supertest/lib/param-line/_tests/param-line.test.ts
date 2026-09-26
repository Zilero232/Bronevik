import { describe, expect, it } from 'vitest';

import { parseParamLine, parseValueCell } from '../param-line';

describe('parseParamLine', () => {
  it('reads an arrow change with decimal commas and a unit on both sides', () => {
    expect(parseParamLine('Время перезарядки: 12,5 с → 11,8 с')).toEqual({
      kind: 'change',
      label: 'Время перезарядки',
      from: 12.5,
      to: 11.8,
      unit: 's',
      raw: 'Время перезарядки: 12,5 с → 11,8 с'
    });
  });

  it('keeps digits that belong to the label, like the 100 m of dispersion', () => {
    expect(parseParamLine('Разброс на 100 м: 0,38 → 0,35 м')).toMatchObject({ label: 'Разброс на 100 м', from: 0.38, to: 0.35, unit: 'm' });
  });

  it('reads an ASCII arrow and thousands with spaces', () => {
    expect(parseParamLine('Прочность: 2 400 -> 2 550 ед.')).toMatchObject({ label: 'Прочность', from: 2400, to: 2550, unit: 'hp' });
  });

  it('reads a unit given only before the arrow', () => {
    expect(parseParamLine('Время сведения: 2,3 с → 2,1')).toMatchObject({ from: 2.3, to: 2.1, unit: 's' });
  });

  it('ignores a trailing percentage note after the new value', () => {
    expect(parseParamLine('Время перезарядки: 12,5 → 11,8 с (−5,6%)')).toMatchObject({ from: 12.5, to: 11.8, unit: 's' });
  });

  it('reads «уменьшено с … до …» prose', () => {
    expect(parseParamLine('Время перезарядки уменьшено с 12,5 до 11,8 с.')).toMatchObject({
      kind: 'change',
      label: 'Время перезарядки',
      from: 12.5,
      to: 11.8,
      unit: 's'
    });
  });

  it('reads «изменён с … до …» with a colon and km/h', () => {
    expect(parseParamLine('Максимальная скорость назад: изменена с 16 до 20 км/ч')).toMatchObject({
      label: 'Максимальная скорость назад',
      from: 16,
      to: 20,
      unit: 'kmh'
    });
  });

  it('reads a range phrase with no verb', () => {
    expect(parseParamLine('Обзор с 390 до 400 м')).toMatchObject({ label: 'Обзор', from: 390, to: 400, unit: 'm' });
  });

  it('reads negative angles written with a typographic minus', () => {
    expect(parseParamLine('Угол склонения орудия: −8° → −10°')).toMatchObject({ from: -8, to: -10, unit: 'deg' });
  });

  it('reads «было … стало …»', () => {
    expect(parseParamLine('Бронепробиваемость: было 258 мм, стало 268 мм')).toMatchObject({
      kind: 'change',
      label: 'Бронепробиваемость',
      from: 258,
      to: 268,
      unit: 'mm'
    });
  });

  it('reads a single characteristic of a new vehicle as a value', () => {
    expect(parseParamLine('Прочность: 1 950 ед.')).toEqual({
      kind: 'value',
      label: 'Прочность',
      value: 1950,
      unit: 'hp',
      raw: 'Прочность: 1 950 ед.'
    });
  });

  it('reads a value with degrees per second', () => {
    expect(parseParamLine('Скорость поворота башни: 30,5 град/с')).toMatchObject({ kind: 'value', value: 30.5, unit: 'deg_s' });
  });

  it('returns null for prose with no numbers', () => {
    expect(parseParamLine('Машина получит улучшенную бронезащиту лобовой проекции.')).toBeNull();
  });

  it('returns null for an empty line', () => {
    expect(parseParamLine('   ')).toBeNull();
  });

  it('returns null when the label has no letters', () => {
    expect(parseParamLine('1: 2 → 3')).toBeNull();
  });
});

describe('parseValueCell', () => {
  it('reads a lone table cell with a unit', () => {
    expect(parseValueCell('0,35 м')).toEqual({ value: 0.35, unit: 'm' });
  });

  it('reads a lone number without a unit', () => {
    expect(parseValueCell('2 400')).toEqual({ value: 2400, unit: null });
  });

  it('returns null for a cell with text around the number', () => {
    expect(parseValueCell('до 2 400')).toBeNull();
  });
});
