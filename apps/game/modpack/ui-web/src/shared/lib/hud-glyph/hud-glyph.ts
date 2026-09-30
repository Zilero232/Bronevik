import type { GlyphPaths } from './hud-glyph.types';

import { HUD_GLYPHS } from '../../config';

const shapes: Partial<Record<string, readonly string[]>> = HUD_GLYPHS.shapes;
const details: Partial<Record<string, readonly string[]>> = HUD_GLYPHS.details;

export const glyphPaths = (name: string): GlyphPaths => ({ shapes: shapes[name] ?? HUD_GLYPHS.shapes.damage, details: details[name] ?? [] });
