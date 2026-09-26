import type { GAME_ICON_FALLBACK } from '../../config';

export type GameIconKind = keyof typeof GAME_ICON_FALLBACK;

export type GameIconProps = {
  src: string | null;
  size: number;
  kind: GameIconKind;
  className?: string;
};
