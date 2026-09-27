import type { Plugin } from 'vite';

import { UI_BUILD } from '../vite.constants';

export const toClassicScript = (html: string): string => {
  const match = UI_BUILD.html.moduleScript.exec(html);

  if (!match) {
    return html;
  }

  const [tag, code = ''] = match;
  const page = html.slice(0, match.index) + html.slice(match.index + tag.length);
  const bodyEnd = page.lastIndexOf(UI_BUILD.html.bodyEnd);

  if (bodyEnd === -1) {
    return html;
  }

  return `${page.slice(0, bodyEnd)}  <script>${code}</script>\n  ${page.slice(bodyEnd)}`;
};

export const classicScriptPlugin = (): Plugin => ({
  name: 'otmetki:classic-script',
  apply: 'build',
  enforce: 'post',
  generateBundle(_options, bundle) {
    for (const file of Object.values(bundle)) {
      if (file.type === 'asset' && file.fileName.endsWith(UI_BUILD.html.extension) && typeof file.source === 'string') {
        file.source = toClassicScript(file.source);
      }
    }
  }
});
