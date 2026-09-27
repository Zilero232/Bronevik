import { describe, expect, it } from 'vitest';

import { toClassicScript } from '../classic-script';

const PAGE = [
  '<!doctype html>',
  '<html lang="ru">',
  '  <head>',
  '    <meta charset="UTF-8" />',
  '    <script type="module" crossorigin>(function(){var a=`$&`;})();</script>',
  '    <style rel="stylesheet" crossorigin>.a{color:red}</style>',
  '  </head>',
  '  <body>',
  '    <div id="root"></div>',
  '  </body>',
  '</html>'
].join('\n');

describe(toClassicScript, () => {
  it('moves the inlined module script to the end of the body as a classic script', () => {
    const html = toClassicScript(PAGE);

    expect(html).not.toContain('type="module"');
    expect(html).toMatch(/<div id="root"><\/div>\n\s*<script>\(function\(\)\{var a=`\$&`;\}\)\(\);<\/script>\n\s*<\/body>/);
  });

  it('keeps the head styles where they are', () => {
    expect(toClassicScript(PAGE)).toContain('<style rel="stylesheet" crossorigin>.a{color:red}</style>\n  </head>');
  });

  it('leaves a page without a module script unchanged', () => {
    const page = '<html><body><div></div></body></html>';

    expect(toClassicScript(page)).toBe(page);
  });
});
