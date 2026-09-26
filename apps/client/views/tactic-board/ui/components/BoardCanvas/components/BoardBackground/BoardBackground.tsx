'use client';

import { Line, Rect, Text } from 'react-konva';

import type { BoardBackgroundProps } from './BoardBackground.types';

export const BoardBackground = ({ grid, palette, mapName, size }: BoardBackgroundProps) => (
  <>
    <Rect fill={palette.background} height={size} width={size} x={0} y={0} />
    {mapName && (
      <Text
        align='center'
        fill={palette.label}
        fontSize={64}
        fontStyle='bold'
        height={size}
        opacity={0.25}
        text={mapName.toUpperCase()}
        verticalAlign='middle'
        width={size}
      />
    )}
    {grid.lines.map((offset) => (
      <Line key={`v${offset}`} points={[offset, 0, offset, size]} stroke={palette.grid} strokeWidth={1} />
    ))}
    {grid.lines.map((offset) => (
      <Line key={`h${offset}`} points={[0, offset, size, offset]} stroke={palette.grid} strokeWidth={1} />
    ))}
    <Rect height={size} stroke={palette.gridStrong} strokeWidth={2} width={size} />
    {grid.rowLabels.map(({ label, offset }) => (
      <Text key={`r${label}`} fill={palette.label} fontSize={14} text={label} x={6} y={offset - 7} />
    ))}
    {grid.columnLabels.map(({ label, offset }) => (
      <Text key={`c${label}`} fill={palette.label} fontSize={14} text={label} x={offset - 4} y={6} />
    ))}
  </>
);
