import type { SilhouetteBlurInput } from './silhouette-blur.types';

import { GUESS_CLUES, GUESS_VIEW } from '../../config';

export const silhouetteBlur = ({ clueCount, isOver }: SilhouetteBlurInput) =>
  isOver ? 0 : Math.round(GUESS_VIEW.maxBlur * (1 - clueCount / (GUESS_CLUES.length + 1)));
