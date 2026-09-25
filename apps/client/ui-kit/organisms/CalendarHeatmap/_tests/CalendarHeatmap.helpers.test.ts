import { describe, expect, it } from 'vitest';

import { calendarLayout, heatLevel } from '../CalendarHeatmap.helpers';

const LEVELS = 5;
const DAYS_IN_WEEK = 7;

const DAYS = Array.from({ length: 20 }, (_, index) => ({ date: `2026-03-${String(index + 1).padStart(2, '0')}`, value: index }));

describe('heatLevel', () => {
  it('keeps an idle day at level zero', () => {
    expect(heatLevel({ value: 0, max: 40, levels: LEVELS })).toBe(0);
  });

  it('lifts any active day above zero, however small', () => {
    expect(heatLevel({ value: 1, max: 1_000, levels: LEVELS })).toBe(1);
  });

  it('puts the busiest day on the top level', () => {
    expect(heatLevel({ value: 40, max: 40, levels: LEVELS })).toBe(LEVELS - 1);
  });

  it('never rises when the value falls', () => {
    const levels = [40, 30, 20, 10, 1].map((value) => heatLevel({ value, max: 40, levels: LEVELS }));

    expect(levels).toEqual([...levels].sort((a, b) => b - a));
  });
});

describe('calendarLayout', () => {
  it('pads the first week so each column starts on Monday', () => {
    const { weeks } = calendarLayout(DAYS);
    const firstReal = weeks[0].findIndex(({ day }) => day !== null);

    expect(firstReal).toBe((new Date('2026-03-01T00:00:00Z').getUTCDay() + 6) % DAYS_IN_WEEK);
  });

  it('keeps every day exactly once', () => {
    const { weeks } = calendarLayout(DAYS);

    expect(weeks.flat().filter(({ day }) => day !== null)).toHaveLength(DAYS.length);
  });

  it('fills every week to seven cells', () => {
    calendarLayout(DAYS).weeks.forEach((week) => expect(week).toHaveLength(DAYS_IN_WEEK));
  });

  it('labels the month where the range starts', () => {
    expect(calendarLayout(DAYS).months[0]).toEqual({ index: 0, date: DAYS[0].date });
  });

  it('drops a partial first month when the next label would collide with it', () => {
    const days = Array.from({ length: 30 }, (_, index) => ({ date: new Date(Date.UTC(2026, 2, 28 + index)).toISOString().slice(0, 10), value: 1 }));

    expect(calendarLayout(days).months.map(({ date }) => date.slice(5, 7))).toEqual(['04']);
  });

  it('gives every cell a unique key', () => {
    const keys = calendarLayout(DAYS).weeks.flatMap((week) => week.map(({ key }) => key));

    expect(new Set(keys).size).toBe(keys.length);
  });

  it('returns nothing for an empty range', () => {
    expect(calendarLayout([])).toEqual({ weeks: [], months: [] });
  });
});
