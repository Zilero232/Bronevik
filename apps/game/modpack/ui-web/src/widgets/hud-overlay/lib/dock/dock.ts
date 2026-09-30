import { groupBy, sortBy } from 'remeda';

import type { Rect } from '../../../../shared/lib/hud-geometry';
import type { DockItem, LiftInput, LimitInput, RoofInput, SettledPanelsInput, StackDocksInput } from './dock.types';

import { clampRect } from '../../../../shared/lib/hud-geometry';

type Column = { first: Rect; previous: Rect; widest: number };

const below = ({ previous }: Column, item: DockItem, gap: number): number =>
  item.upward ? previous.top - gap - item.rect.height : previous.top + previous.height + gap;

const overflows = ({ top, height, upward, limit }: { top: number; height: number; upward: boolean; limit: number }): boolean =>
  upward ? top < limit : top + height > limit;

const nextColumnLeft = ({ column, item, gap }: { column: Column; item: DockItem; gap: number }): number =>
  item.align === 'right' ? column.first.left - gap - item.rect.width : column.first.left + column.widest + gap;

const inColumn = ({ column, item }: { column: Column; item: DockItem }): number => {
  if (item.align === 'center') {
    return column.first.left + (column.first.width - item.rect.width) / 2;
  }

  return item.align === 'right' ? column.first.left + column.first.width - item.rect.width : column.first.left;
};

const bottomLimit = ({ item, screen, reserve }: LimitInput): number => {
  const stop = item.dock?.stop_center;

  return stop === undefined ? screen.height - (item.dock?.reserve ?? reserve) : screen.height / 2 - stop;
};

const overlapsX = (a: Rect, b: Rect): boolean => a.left < b.left + b.width && b.left < a.left + a.width;

const roofOf = ({ first, free, gap, ceiling }: RoofInput): number =>
  free
    .filter((rect) => overlapsX(rect, first.rect) && rect.top < first.rect.top)
    .reduce((roof, rect) => Math.max(roof, rect.top + rect.height + gap), Math.min(first.dock?.ceiling ?? ceiling, first.rect.top));

const liftedTop = ({ members, free, screen, gap, reserve, ceiling }: LiftInput): number | null => {
  const [first] = members;

  if (!first || first.upward) {
    return null;
  }

  const total = members.reduce((sum, item) => sum + item.rect.height, 0) + gap * (members.length - 1);
  const limit = bottomLimit({ item: first, screen, reserve });

  return first.rect.top + total > limit ? Math.max(roofOf({ first, free, gap, ceiling }), limit - total) : null;
};

// The panels of one docked column (core/hud/panel DOCKS) all sit at the column's anchor: the first in `order` keeps
// that place, each next one goes right under the one before it (above it for a bottom anchor), so default places never
// overlap whatever height a panel has. A top-anchored column taller than the room down to its group's reserve (the strip
// kept free at the bottom; `reserve` when the group names none) first moves up, not above `ceiling` nor into an undocked panel above it; a panel that still
// crosses the reserve starts a new column beside the first, towards the middle of the screen. Undocked panels keep
// their rect.
export const stackDocks = ({ items, screen, gap, reserve, ceiling }: StackDocksInput): Map<string, Rect> => {
  const placed = new Map(items.map((item) => [item.id, item.rect]));
  const groups = groupBy(
    items.filter((item) => item.dock !== null),
    (item) => item.dock?.group ?? ''
  );

  const free = items.filter((item) => item.dock === null).map((item) => item.rect);

  Object.values(groups).forEach((unsorted) => {
    const members = sortBy(unsorted, (item) => item.dock?.order ?? 0);
    const lifted = liftedTop({ members, free, screen, gap, reserve, ceiling });
    let column: Column | null = null;

    members.forEach((item) => {
      if (!column) {
        const rect = lifted === null ? item.rect : { ...item.rect, top: lifted };

        column = { first: rect, previous: rect, widest: rect.width };
        placed.set(item.id, rect);

        return;
      }

      const limit = item.upward ? (item.dock?.reserve ?? reserve) : bottomLimit({ item, screen, reserve });
      const top = below(column, item, gap);
      const wraps = overflows({ top, height: item.rect.height, upward: item.upward, limit });
      const left = wraps ? nextColumnLeft({ column, item, gap }) : inColumn({ column, item });
      const rect = clampRect({ rect: { ...item.rect, left, top: wraps ? column.first.top : top }, screen });

      column = wraps
        ? { first: rect, previous: rect, widest: rect.width }
        : { ...column, previous: rect, widest: Math.max(column.widest, rect.width) };

      placed.set(item.id, rect);
    });
  });

  return placed;
};

export const settledPanels = ({ items, measured }: SettledPanelsInput): Set<string> => {
  const waiting = new Set(items.filter((item) => item.dock !== null && !measured(item.id)).map((item) => item.dock?.group));

  return new Set(items.filter((item) => measured(item.id) && !(item.dock && waiting.has(item.dock.group))).map((item) => item.id));
};
