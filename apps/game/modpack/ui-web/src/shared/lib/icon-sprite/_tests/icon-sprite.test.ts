import { describe, expect, it } from 'vitest';

import { UI_ICONS } from '../../../config';
import { spriteCell, spriteRowsPerTone, spriteSize, spriteStyle } from '../icon-sprite';

describe(spriteCell, () => {
  it('lays the names out row by row, one block of rows per tone', () => {
    expect(spriteCell({ name: 'logo', tone: 'muted' })).toEqual({ column: 0, row: 0 });
    expect(spriteCell({ name: UI_ICONS.names[UI_ICONS.columns + 1] ?? 'logo', tone: 'muted' })).toEqual({ column: 1, row: 1 });
    expect(spriteCell({ name: 'logo', tone: 'accent' })).toEqual({ column: 0, row: 2 * spriteRowsPerTone() });
  });

  it('gives every name and tone its own cell inside the sprite', () => {
    const { columns, rows } = spriteSize();
    const cells = UI_ICONS.tones.flatMap((tone) => UI_ICONS.names.map((name) => spriteCell({ name, tone })));

    expect(new Set(cells.map(({ column, row }) => `${column}:${row}`)).size).toBe(cells.length);

    cells.forEach(({ column, row }) => {
      expect(column).toBeLessThan(columns);
      expect(row).toBeLessThan(rows);
    });
  });
});

describe(spriteStyle, () => {
  it('scales the sprite to the icon size in rem and points at the cell', () => {
    const { columns, rows } = spriteSize();
    const style = spriteStyle({ name: 'logo', tone: 'text', size: 20 });

    expect(style).toEqual({
      width: '20rem',
      height: '20rem',
      backgroundImage: `url(${UI_ICONS.file})`,
      backgroundSize: `${columns * 20}rem ${rows * 20}rem`,
      backgroundPosition: `0rem ${-spriteRowsPerTone() * 20}rem`
    });
  });
});
