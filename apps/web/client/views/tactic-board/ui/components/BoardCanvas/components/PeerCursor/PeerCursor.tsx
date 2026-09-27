'use client';

import { Circle, Group, Text } from 'react-konva';

import type { PeerCursorProps } from './PeerCursor.types';

export const PeerCursor = ({ name, color, cursor, scale }: PeerCursorProps) => (
  <Group scaleX={1 / scale} scaleY={1 / scale} x={cursor.x} y={cursor.y}>
    <Circle fill={color} radius={5} />
    {name && <Text fill={color} fontSize={12} text={name} x={8} y={-6} />}
  </Group>
);
