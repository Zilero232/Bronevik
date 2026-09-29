import type { ParsedIcon } from './hud-icon.types';

import { HUD_ICON } from './hud-icon.constants';

const glyphOf = (part: string | undefined): string | null =>
  part?.startsWith(HUD_ICON.glyphScheme) ? part.slice(HUD_ICON.glyphScheme.length) : null;

export const parseIcon = (value: string | null | undefined): ParsedIcon => {
  if (!value) {
    return { image: null, glyph: null };
  }

  const [head, tail] = value.split(HUD_ICON.fallbackSeparator);

  if (head?.startsWith(HUD_ICON.imageScheme)) {
    return { image: head, glyph: glyphOf(tail) };
  }

  return { image: null, glyph: glyphOf(head) };
};
