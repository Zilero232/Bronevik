import type { ShowcaseCanvasProps } from '../../ShowcaseCanvas.types';

export type HologramTankProps = Pick<ShowcaseCanvasProps, 'drag' | 'onReady' | 'slug'> & {
  isLive: boolean;
};
