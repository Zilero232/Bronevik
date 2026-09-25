import type { CheerioAPI } from 'cheerio';

export const textLines = ($: CheerioAPI): string[] => {
  const root = $('article').first().length > 0 ? $('article').first() : $('body');

  return root
    .find('*')
    .addBack()
    .contents()
    .toArray()
    .flatMap((node) => (node.type === 'text' ? [$(node).text().replaceAll(/\s+/g, ' ').trim()] : []))
    .filter((line) => line.length > 0);
};
