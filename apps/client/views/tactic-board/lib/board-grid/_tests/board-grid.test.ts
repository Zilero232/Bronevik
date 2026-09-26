import { describe, expect, it } from 'vitest';

import { BOARD } from '../../../config';
import { boardGrid } from '../board-grid';

const GRID = boardGrid({ size: BOARD.size, rows: BOARD.gridRows });

describe('boardGrid', () => {
  it('draws only the inner lines, the frame is the board edge', () => {
    expect(GRID.lines).toHaveLength(BOARD.gridRows.length - 1);
    expect(GRID.lines[0]).toBe(BOARD.size / BOARD.gridRows.length);
  });

  it('labels rows with minimap letters and columns 1 to 0', () => {
    expect(GRID.rowLabels.map(({ label }) => label).join('')).toBe('ABCDEFGHJK');
    expect(GRID.columnLabels.map(({ label }) => label).join('')).toBe('1234567890');
  });

  it('centers labels inside their cells', () => {
    expect(GRID.rowLabels[0]?.offset).toBe(GRID.step / 2);
  });
});
