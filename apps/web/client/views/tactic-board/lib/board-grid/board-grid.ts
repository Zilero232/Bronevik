import type { BoardGrid, BoardGridInput } from './board-grid.types';

export const boardGrid = ({ size, rows }: BoardGridInput): BoardGrid => {
  const step = size / rows.length;
  const centers = rows.map((_, index) => step * index + step / 2);

  return {
    step,
    lines: Array.from({ length: rows.length - 1 }, (_, index) => step * (index + 1)),
    rowLabels: rows.map((label, index) => ({ label, offset: centers[index] ?? 0 })),
    columnLabels: rows.map((_, index) => ({ label: String((index + 1) % 10), offset: centers[index] ?? 0 }))
  };
};
