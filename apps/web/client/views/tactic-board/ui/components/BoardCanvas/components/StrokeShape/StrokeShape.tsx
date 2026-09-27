'use client';

import { Arrow, Circle, Line, Rect, Text } from 'react-konva';

import type { StrokeShapeProps } from './StrokeShape.types';

import { BOARD } from '../../../../../config';

export const StrokeShape = ({ item, selectionColor, isListening, draggable = false }: StrokeShapeProps) => {
  const { stroke, geometry, isSelected, onPress, onDragEnd } = item;
  const common = {
    draggable,
    listening: isListening,
    hitStrokeWidth: BOARD.hitStrokeWidth,
    shadowColor: selectionColor,
    shadowBlur: isSelected ? BOARD.selectionBlur : 0,
    shadowOpacity: isSelected ? 1 : 0,
    onPointerDown: onPress,
    onDragEnd
  };

  switch (stroke.tool) {
    case 'arrow':
      return (
        <Arrow
          {...common}
          fill={stroke.color}
          lineCap='round'
          pointerLength={geometry.pointer}
          pointerWidth={geometry.pointer}
          points={stroke.points}
          stroke={stroke.color}
          strokeWidth={stroke.width}
        />
      );
    case 'circle':
      return (
        <Circle
          {...common}
          radius={geometry.circle.radius}
          stroke={stroke.color}
          strokeWidth={stroke.width}
          x={geometry.circle.x}
          y={geometry.circle.y}
        />
      );
    case 'rect':
      return (
        <Rect
          {...common}
          height={geometry.box.height}
          stroke={stroke.color}
          strokeWidth={stroke.width}
          width={geometry.box.width}
          x={geometry.box.x}
          y={geometry.box.y}
        />
      );
    case 'text':
      return (
        <Text
          {...common}
          fill={stroke.color}
          fontSize={geometry.fontSize}
          text={stroke.text ?? ''}
          x={geometry.anchor.x}
          y={geometry.anchor.y - geometry.fontSize / 2}
        />
      );
    default:
      return (
        <Line
          {...common}
          lineCap='round'
          lineJoin='round'
          points={stroke.points}
          stroke={stroke.color}
          strokeWidth={stroke.width}
          tension={stroke.tool === 'pen' ? BOARD.penTension : 0}
        />
      );
  }
};
