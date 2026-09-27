import type { Plugin } from 'vite';

import { readDesignTokens } from '@otmetki/design-tokens';
import { LOGO_SHAPES } from '@otmetki/icons/shapes';
import { Resvg } from '@resvg/resvg-js';

import type { IconColors } from './icon-png.types';

import { UI_BUILD } from '../vite.constants';

const iconSvg = ({ background, accent }: IconColors): string => {
  const { size, radius, stroke, mark } = UI_BUILD.icon;
  const scale = (size - mark.inset * 2) / mark.viewBox;
  const paths = LOGO_SHAPES.marks.map((d) => `<path d="${d}"/>`).join('');

  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">`,
    `<rect width="${size}" height="${size}" rx="${radius}" fill="${background}"/>`,
    `<g transform="translate(${mark.inset} ${mark.inset}) scale(${scale})" fill="none" stroke="${accent}" stroke-width="${stroke / scale}" stroke-linecap="round">`,
    paths,
    '</g></svg>'
  ].join('');
};

export const iconPng = (colors: IconColors): Uint8Array => new Resvg(iconSvg(colors), { font: { loadSystemFonts: false } }).render().asPng();

export const iconPngPlugin = (): Plugin => ({
  name: 'otmetki:icon-png',
  apply: 'build',
  async generateBundle() {
    const { themes } = await readDesignTokens();
    const { background, accent } = UI_BUILD.icon.tokens;

    this.emitFile({
      type: 'asset',
      fileName: UI_BUILD.icon.file,
      source: iconPng({ background: themes.dark[background] ?? '', accent: themes.dark[accent] ?? '' })
    });
  }
});
