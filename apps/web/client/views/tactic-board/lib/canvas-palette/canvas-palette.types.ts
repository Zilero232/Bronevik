import type { CANVAS_TOKENS } from '../../config';

export type PaletteSource = Pick<CSSStyleDeclaration, 'getPropertyValue'>;

export type CanvasPalette = Record<keyof typeof CANVAS_TOKENS, string>;
