import { ArrowUpRight, Circle, Eraser, MousePointer2, PenLine, Slash, Square, Type } from 'lucide-react';

export const BOARD_TOOL_ICONS = {
  select: MousePointer2,
  pen: PenLine,
  arrow: ArrowUpRight,
  line: Slash,
  circle: Circle,
  rect: Square,
  text: Type,
  eraser: Eraser
} as const;

export const BOARD_TOOLBAR_TOOLS = ['select', 'pen', 'arrow', 'line', 'circle', 'rect', 'text', 'eraser'] as const;

export const BOARD_TANK_KINDS = ['lightTank', 'mediumTank', 'heavyTank', 'AT-SPG', 'SPG'] as const;
