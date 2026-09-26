import { readFile } from 'node:fs/promises';

import { OG_FONTS } from '../og.constants';

const read = async (url: URL) => {
  try {
    return await readFile(url);
  } catch {
    return null;
  }
};

export const loadOgFonts = async () => {
  const [display, body] = await Promise.all([
    read(new URL('../fonts/tektur-700.ttf', import.meta.url)),
    read(new URL('../fonts/onest-500.ttf', import.meta.url))
  ]);

  return [
    ...(display ? [{ name: OG_FONTS.display, data: display, weight: 700 as const, style: 'normal' as const }] : []),
    ...(body ? [{ name: OG_FONTS.body, data: body, weight: 500 as const, style: 'normal' as const }] : [])
  ];
};
