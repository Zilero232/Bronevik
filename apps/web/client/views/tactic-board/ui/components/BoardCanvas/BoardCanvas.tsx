'use client';

import { Group, Layer, Stage } from 'react-konva';

import type { BoardCanvasProps } from './BoardCanvas.types';

import { BOARD } from '../../../config';
import { useBoardCanvas } from '../../../model/hooks';
import { BoardBackground, IconShape, PeerCursor, StrokeShape } from './components';

export const BoardCanvas = ({ width }: BoardCanvasProps) => {
  const {
    scale,
    size,
    palette,
    grid,
    mapName,
    layers,
    draft,
    peers,
    isItemListening,
    canDrag,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerLeave
  } = useBoardCanvas(width);

  return (
    <Stage
      height={size}
      scaleX={scale}
      scaleY={scale}
      width={size}
      onPointerDown={onPointerDown}
      onPointerLeave={onPointerLeave}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      <Layer listening={false}>
        <BoardBackground grid={grid} mapName={mapName} palette={palette} size={BOARD.size} />
      </Layer>
      <Layer>
        {layers.map((layer) => (
          <Group key={layer.id}>
            {layer.strokes.map((item) => (
              <StrokeShape key={item.stroke.id} draggable={canDrag} isListening={isItemListening} item={item} selectionColor={palette.selection} />
            ))}
            {layer.icons.map((item) => (
              <IconShape
                key={item.icon.id}
                draggable={canDrag}
                isListening={isItemListening}
                item={item}
                labelColor={palette.text}
                selectionColor={palette.selection}
              />
            ))}
          </Group>
        ))}
      </Layer>
      <Layer listening={false}>
        {draft && <StrokeShape isListening={false} item={draft} selectionColor={palette.selection} />}
        {peers.map(({ clientId, name, color, cursor }) =>
          cursor ? <PeerCursor key={clientId} color={color} cursor={cursor} name={name} scale={scale} /> : null
        )}
      </Layer>
    </Stage>
  );
};
