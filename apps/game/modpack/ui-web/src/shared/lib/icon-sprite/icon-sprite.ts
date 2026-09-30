import type { SpriteCell, SpriteCellInput, SpriteStyle, SpriteStyleInput } from './icon-sprite.types';

import { UI_ICONS } from '../../config';

const rem = (value: number): string => `${value}rem`;

export const spriteRowsPerTone = (): number => Math.ceil(UI_ICONS.names.length / UI_ICONS.columns);

export const spriteSize = () => ({ columns: UI_ICONS.columns, rows: spriteRowsPerTone() * UI_ICONS.tones.length });

export const spriteCell = ({ name, tone }: SpriteCellInput): SpriteCell => {
  const index = UI_ICONS.names.indexOf(name);
  const toneIndex = UI_ICONS.tones.indexOf(tone);

  return { column: index % UI_ICONS.columns, row: toneIndex * spriteRowsPerTone() + Math.floor(index / UI_ICONS.columns) };
};

export const spriteStyle = ({ name, tone, size }: SpriteStyleInput): SpriteStyle => {
  const { column, row } = spriteCell({ name, tone });
  const { columns, rows } = spriteSize();

  return {
    width: rem(size),
    height: rem(size),
    backgroundImage: `url(${UI_ICONS.file})`,
    backgroundSize: `${rem(columns * size)} ${rem(rows * size)}`,
    backgroundPosition: `${rem(-column * size)} ${rem(-row * size)}`
  };
};
