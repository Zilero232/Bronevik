import { describe, expect, it } from 'vitest';

import type { PlaytimeRow } from '../../../players.types';

import { playtimeCells } from '../playtime';
import { PLAYTIME } from '../playtime.constants';

const row: PlaytimeRow = { weekday: 2, hour: 20, battles: 10, wins: 6, damage: 25_000 };

const cellAt = ({ cells, weekday, hour }: Pick<PlaytimeRow, 'hour' | 'weekday'> & { cells: ReturnType<typeof playtimeCells> }) =>
  cells.find((cell) => cell.weekday === weekday && cell.hour === hour);

describe('playtimeCells', () => {
  it('returns a dense grid of every weekday and hour even without rows', () => {
    const cells = playtimeCells([]);
    const keys = new Set(cells.map((cell) => `${cell.weekday}:${cell.hour}`));

    expect(cells).toHaveLength(PLAYTIME.weekdays * PLAYTIME.hours);
    expect(keys.size).toBe(cells.length);
  });

  it('leaves a cell without rows at zero battles and no rates', () => {
    expect(cellAt({ cells: playtimeCells([row]), weekday: 0, hour: 0 })).toEqual({ weekday: 0, hour: 0, battles: 0, winRate: null, avgDamage: null });
  });

  it('reports the win rate as a percent and the damage per battle', () => {
    expect(cellAt({ ...row, cells: playtimeCells([row]) })).toEqual({
      weekday: row.weekday,
      hour: row.hour,
      battles: row.battles,
      winRate: (row.wins * 100) / row.battles,
      avgDamage: row.damage / row.battles
    });
  });

  it('merges rows that fall into the same cell', () => {
    const other = { ...row, battles: 30, wins: 10, damage: 45_000 };
    const cell = cellAt({ ...row, cells: playtimeCells([row, other]) });
    const battles = row.battles + other.battles;

    expect(cell?.battles).toBe(battles);
    expect(cell?.winRate).toBe(((row.wins + other.wins) * 100) / battles);
    expect(cell?.avgDamage).toBe((row.damage + other.damage) / battles);
  });

  it('gives a present cell with zero battles no rates instead of zero', () => {
    const cell = cellAt({ ...row, cells: playtimeCells([{ ...row, battles: 0, wins: 0, damage: 0 }]) });

    expect(cell?.winRate).toBeNull();
    expect(cell?.avgDamage).toBeNull();
  });

  it('ignores rows outside the grid', () => {
    const cells = playtimeCells([
      { ...row, weekday: PLAYTIME.weekdays },
      { ...row, hour: PLAYTIME.hours }
    ]);

    expect(cells.every((cell) => cell.battles === 0)).toBe(true);
  });
});
