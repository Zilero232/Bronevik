'use client';

import { Group, Line, Text } from 'react-konva';

import type { IconShapeProps } from './IconShape.types';

import { BOARD } from '../../../../../config';

export const IconShape = ({ item, selectionColor, labelColor, isListening, draggable }: IconShapeProps) => {
  const { icon, appearance, isSelected, onPress, onDragEnd } = item;

  return (
    <Group draggable={draggable} listening={isListening} rotation={icon.rotation} x={icon.x} y={icon.y} onDragEnd={onDragEnd} onPointerDown={onPress}>
      <Line
        closed
        fill={appearance.fill}
        hitStrokeWidth={BOARD.hitStrokeWidth}
        points={appearance.glyph.outline}
        shadowBlur={isSelected ? BOARD.selectionBlur : 0}
        shadowColor={selectionColor}
        shadowOpacity={isSelected ? 1 : 0}
        stroke={appearance.stroke}
        strokeWidth={appearance.fill ? 1.5 : 3}
      />
      {appearance.glyph.lines.map((points) => (
        <Line key={points.join(',')} lineCap='round' points={points} stroke={appearance.stroke} strokeWidth={2.5} />
      ))}
      {icon.label && (
        <Text
          align='center'
          fill={labelColor}
          fontSize={12}
          offsetX={BOARD.iconLabelWidth / 2}
          text={icon.label}
          width={BOARD.iconLabelWidth}
          y={appearance.labelOffset}
        />
      )}
    </Group>
  );
};
